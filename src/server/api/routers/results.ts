import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { PrismaClient } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAppState } from "~/utils/state";
import { FilterSchema } from "~/features/filter/types";
import { fetchAttestations } from "~/utils/fetchAttestations";
import { eas } from "~/config";
import { calculateResults } from "~/utils/calculateResults";

export const resultsRouter = createTRPCRouter({
  stats: publicProcedure.query(async ({ ctx }) =>
    calculateBallotResults(ctx.db),
  ),
  project: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { projects } = await calculateBallotResults(ctx.db);

      return {
        amount: projects[input.id],
      };
    }),

  projects: publicProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const { projects } = await calculateBallotResults(ctx.db);

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

async function calculateBallotResults(
  db: PrismaClient,
): Promise<BallotResults> {
  if (getAppState() !== "RESULTS") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Voting has not ended yet",
    });
  }

  const ballots = await db.ballot.findMany({
    where: { publishedAt: { not: undefined } },
  });

  return calculateResults(ballots);
}
