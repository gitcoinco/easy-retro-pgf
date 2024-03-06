import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { PrismaClient } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAppState } from "~/utils/state";
import { FilterSchema } from "~/features/filter/types";
import { fetchAttestations } from "~/utils/fetchAttestations";
import { eas } from "~/config";
import {
  BallotResults,
  PayoutOptions,
  calculateResults,
  calculateVotes,
} from "~/utils/calculateResults";
import { Vote } from "~/features/ballot/types";

export const resultsRouter = createTRPCRouter({
  stats: publicProcedure.query(async ({ ctx }) =>
    calculateBallotResults(ctx.db),
  ),
  votes: publicProcedure
    .input(
      z.object({
        style: z.enum(["custom", "op"]),
        threshold: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => calculateBallotResults(ctx.db, input)),
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

async function calculateBallotResults(
  db: PrismaClient,
  payoutOpts: PayoutOptions,
) {
  if (getAppState() !== "RESULTS") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Voting has not ended yet",
    });
  }

  // When the Minimum Qurom input is empty, return empty
  if (payoutOpts.style === "op" && !payoutOpts.threshold) {
    return;
  }

  // Fetch the ballots
  const ballots = await db.ballot.findMany({
    where: { publishedAt: { not: undefined } },
  });

  const projects = calculateVotes(
    ballots as unknown as { voterId: string; votes: Vote[] }[],
    payoutOpts,
  );

  return { projects };
}
