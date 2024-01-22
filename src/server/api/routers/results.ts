import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { PrismaClient } from "@prisma/client";
import { type Vote } from "~/features/ballot/types";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAppState } from "~/utils/state";
import { FilterSchema } from "~/features/filter/types";
import { fetchAttestations } from "~/utils/fetchAttestations";
import { eas } from "~/config";

export const resultsRouter = createTRPCRouter({
  stats: publicProcedure.query(async ({ ctx }) => calculateResults(ctx.db)),
  project: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { projects } = await calculateResults(ctx.db);

      return {
        amount: projects[input.id],
      };
    }),

  projects: publicProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const { projects } = await calculateResults(ctx.db);

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
  if (getAppState() !== "RESULTS") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Voting has not ended yet",
    });
  }

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

function calculateAverage(votes: number[]) {
  if (votes.length === 0) {
    return 0;
  }

  const sum = votes.reduce((sum, x) => sum + x, 0);

  const average = sum / votes.length;

  return Math.round(average);
}
