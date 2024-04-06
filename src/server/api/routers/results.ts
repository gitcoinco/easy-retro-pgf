import { z } from "zod";
import type { PrismaClient } from "@prisma/client";
import {
  attestationProcedure,
  createTRPCRouter,
  roundProcedure,
} from "~/server/api/trpc";
import { FilterSchema } from "~/features/filter/types";
import { calculateVotes } from "~/utils/calculateResults";
import { type Vote } from "~/features/ballot/types";

export const resultsRouter = createTRPCRouter({
  votes: roundProcedure.query(async ({ ctx }) =>
    calculateBallotResults(String(ctx.round?.id), ctx.db),
  ),
  projects: attestationProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const { projects } = await calculateBallotResults(
        String(ctx.round?.id),
        ctx.db,
      );

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

async function calculateBallotResults(roundId: string, db: PrismaClient) {
  const round = await db.round.findFirstOrThrow({ where: { id: roundId } });

  const calculation = {
    style: round.calculationType,
    threshold: (round.calculationConfig as { threshold: number }).threshold,
  };
  // Fetch the ballots
  const ballots = await db.ballot.findMany({
    where: { roundId, publishedAt: { not: null } },
  });

  const projects = calculateVotes(
    ballots as unknown as { voterId: string; votes: Vote[] }[],
    calculation,
  );

  const averageVotes = 0;
  const totalVotes = Object.values(projects).reduce(
    (sum, x) => sum + x.votes,
    0,
  );
  const totalVoters = ballots.length;

  return { projects, totalVoters, totalVotes, averageVotes };
}
