import { z } from "zod";
import type { PrismaClient } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { FilterSchema } from "~/features/filter/types";
import { fetchAttestations } from "~/utils/fetchAttestations";
import { config, eas } from "~/config";
import { calculateVotes } from "~/utils/calculateResults";
import { type Vote } from "~/features/ballot/types";
import { getSettings } from "./config";
import { type TallyData } from "maci-cli/sdk";
import { getAllApprovedProjects } from "./projects";
import { TRPCError } from "@trpc/server";

export const resultsRouter = createTRPCRouter({
  votes: publicProcedure
    .input(z.object({ pollId: z.string().nullish() }))
    .query(async ({ ctx, input }) =>
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
        amount: projects?.[input.id]?.votes ?? 0,
      };
    }),

  projects: publicProcedure
    .input(FilterSchema.extend({ pollId: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      const { projects } = await (input?.pollId !== undefined &&
      input?.pollId !== null
        ? calculateMaciResults(input.pollId)
        : calculateResults(ctx.db));

      const sortedIDs = Object.entries(projects ?? {})
        .sort((a, b) => b[1].votes - a[1].votes)
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

export async function calculateResults(db: PrismaClient) {
  const settings = await getSettings(db);
  const calculation = settings?.config?.calculation;

  if (!calculation) {
    console.log("No calculation stored");
    return {};
  }

  // When the Minimum Qurom input is empty, return empty
  if (calculation?.style === "op" && !calculation?.threshold) {
    return {};
  }

  const ballots = await db.ballot.findMany();

  const projects = calculateVotes(
    ballots as unknown as { voterId: string; votes: Vote[] }[],
    calculation,
  );

  const totalVotes = ballots.reduce((sum, x) => sum + x.votes.length, 0);

  return {
    averageVotes: 0,
    totalVoters: ballots.length,
    totalVotes,
    projects,
  };
}

export async function calculateMaciResults(pollId: string) {
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
      acc.set(projects[index]!.id, { votes: Number(tally), voters: 0 });
    }

    return acc;
  }, new Map<string, { votes: number; voters: number }>());

  const averageVotes = calculateAverage(
    Object.values(Object.fromEntries(results)).map(({ votes }) => votes),
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
