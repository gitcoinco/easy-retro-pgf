import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { PrismaClient } from "@prisma/client";
import type { TallyData } from "maci-cli/sdk";
import { type Vote } from "~/features/ballot/types";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { FilterSchema } from "~/features/filter/types";
import { fetchAttestations } from "~/utils/fetchAttestations";
import { config, eas } from "~/config";
import { getAllApprovedProjects } from "./projects";

export const resultsRouter = createTRPCRouter({
  stats: publicProcedure
    .input(z.object({ pollId: z.string().nullish() }))
    .query(async ({ input, ctx }) =>
      input?.pollId !== undefined && input?.pollId !== null
        ? calculateMaciResults(input.pollId)
        : calculateResults(ctx.db),
    ),

  project: publicProcedure
    .input(z.object({ id: z.string(), pollId: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      const { projects } = await (input?.pollId !== undefined &&
      input?.pollId !== null
        ? calculateMaciResults(input.pollId)
        : calculateResults(ctx.db));

      return {
        amount: projects[input.id],
      };
    }),

  projects: publicProcedure
    .input(FilterSchema.extend({ pollId: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      const { projects } = await (input?.pollId !== undefined &&
      input?.pollId !== null
        ? calculateMaciResults(input.pollId)
        : calculateResults(ctx.db));

      const sortedIDs = Object.entries(projects)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id)
        .slice(
          input.cursor * input.limit,
          input.cursor * input.limit + input.limit,
        );

      return fetchAttestations([eas.schemas.metadata], {
        where: {
          id: { in: sortedIDs },
        },
      }).then((attestations) =>
        // Results aren't returned from EAS in the same order as the `where: { in: sortedIDs }`
        // Sort the attestations based on the sorted array
        attestations.sort(
          (a, b) => sortedIDs.indexOf(a.id) - sortedIDs.indexOf(b.id),
        ),
      );
    }),
});

type BallotResults = {
  averageVotes: number;
  totalVotes: number;
  totalVoters: number;
  projects: Record<string, number>;
};

export async function calculateResults(
  db: PrismaClient,
): Promise<BallotResults> {
  const ballots = await db.ballot.findMany();
  let totalVotes = 0;
  const projects = new Map<string, number>();

  ballots
    .filter((ballot) => ballot.publishedAt)
    .forEach((ballot) => {
      ballot.votes.forEach((vote) => {
        const rewards = projects.get((vote as Vote).projectId) ?? 0;
        projects.set((vote as Vote).projectId, rewards + (vote as Vote).amount);

        totalVotes += 1;
      });
    });

  const averageVotes = calculateAverage(
    Object.values(Object.fromEntries(projects)),
  );

  return {
    averageVotes,
    totalVoters: ballots.length,
    totalVotes: totalVotes,
    projects: Object.fromEntries(projects),
  };
}

export async function calculateMaciResults(
  pollId: string,
): Promise<Omit<BallotResults, "totalVotes" | "totalVoters">> {
  const [tallyData, projects] = await Promise.all([
    fetch(`${config.tallyUrl}/tally-${pollId}.json`)
      .then((res) => res.json() as Promise<TallyData>)
      .catch(() => undefined),
    getAllApprovedProjects(),
  ]);

  if (!tallyData) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Voting has not ended yet",
    });
  }

  const results = tallyData.results.tally.reduce((acc, tally, index) => {
    if (projects[index]) {
      acc.set(projects[index]!.id, Number(tally));
    }

    return acc;
  }, new Map<string, number>());

  const averageVotes = calculateAverage(
    Object.values(Object.fromEntries(results)),
  );

  return {
    averageVotes,
    projects: Object.fromEntries(results),
  };
}

function calculateAverage(votes: number[]) {
  if (votes.length === 0) {
    return 0;
  }

  const sum = votes.reduce((sum, x) => sum + x, 0);

  const average = sum / votes.length;

  return Math.round(average);
}
