import type { PrismaClient, Round } from "@prisma/client";
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
import { RoundSchema, RoundTypes } from "~/features/rounds/types";

export const resultsRouter = createTRPCRouter({
  votes: adminProcedure.query(async ({ ctx }) => calculateBallotResults(ctx)),
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
    return calculateBallotResults(ctx);
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

async function calculateBallotResults({
  db,
  round,
}: {
  db: PrismaClient;
  round: Round;
}) {
  const calculation = {
    calculation: round.calculationType as "average" | "median" | "sum",
    threshold: (round.calculationConfig as { threshold: number })?.threshold,
  };
  // Fetch the ballots
  const ballots = await db.ballotV2.findMany({
    where: { roundId: round.id, publishedAt: { not: null } },
    select: { voterId: true, allocations: true },
  });

  if (round.type === RoundTypes.impact) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Calculations for impact rounds not implemented yet",
    });
  }

  const votes = calculateVotes(ballots, calculation);

  const averageVotes = 0;
  const totalVotes = Math.floor(
    Object.values(votes).reduce((sum, x) => sum + (x.allocations ?? 0), 0),
  );
  const totalVoters = ballots.length;

  return { votes, totalVoters, totalVotes, averageVotes };
}
