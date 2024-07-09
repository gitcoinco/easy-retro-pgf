import type { PrismaClient, Round } from "@prisma/client";
import { calculateVotes } from "~/server/api/utils/calculateResults";
import { TRPCError } from "@trpc/server";
import { RoundTypes } from "~/features/rounds/types";

export async function calculateBallotResults({
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
