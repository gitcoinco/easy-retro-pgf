import type { PrismaClient } from "@prisma/client";
import {
  adminProcedure,
  attestationProcedure,
  roundProcedure,
  createTRPCRouter,
} from "~/server/api/trpc";
import { FilterSchema } from "~/features/filter/types";
import { calculateVotes } from "~/utils/calculateResults";
import { type Vote } from "~/features/ballot/types";
import { TRPCError } from "@trpc/server";
import { getState } from "~/features/rounds/hooks/useRoundState";
import { RoundSchema } from "~/features/rounds/types";
import { calculateBallotResults } from "~/server/api/utils/calculateBallotResults";

export const resultsRouter = createTRPCRouter({
  votes: adminProcedure.query(async ({ ctx }) =>
    calculateBallotResults(String(ctx.round?.id), ctx.db),
  ),
  results: roundProcedure.query(async ({ ctx }) => {
    const round = await ctx.db.round.findFirst({ where: { id: ctx.round.id } });
    if (!round) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }
    if (getState(round as unknown as RoundSchema) !== "RESULTS") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Results not available yet",
      });
    }
    return calculateBallotResults(ctx.round.id, ctx.db);
  }),

  projects: attestationProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const roundId = String(ctx.round?.id);

      if (getState(ctx.round) !== "RESULTS") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Results not available yet",
        });
      }
      const { projects } = await calculateBallotResults(roundId, ctx.db);

      const sortedIDs = Object.entries(projects ?? {})
        .sort((a, b) => b[1].votes - a[1].votes)
        .map(([id]) => id)
        .slice(
          input.cursor * input.limit,
          input.cursor * input.limit + input.limit,
        );

      return ctx
        .fetchAttestations(["metadata"], {
          where: {
            id: { in: sortedIDs },
          },
        })
        .then((attestations) =>
          // Results aren't returned from EAS in the same order as the `where: { in: sortedIDs }`
          // Sort the attestations based on the sorted array
          attestations.sort(
            (a, b) => sortedIDs.indexOf(a.id) - sortedIDs.indexOf(b.id),
          ),
        );
    }),
});
