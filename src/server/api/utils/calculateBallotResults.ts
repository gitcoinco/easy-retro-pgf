import type { PrismaClient } from "@prisma/client";
import { calculateVotes } from "~/utils/calculateResults";
import { type Vote } from "~/features/ballot/types";

export async function calculateBallotResults(
  roundId: string,
  db: PrismaClient,
) {
  const round = await db.round.findFirstOrThrow({ where: { id: roundId } });
  // const calculation = settings?.config?.calculation ?? defaultCalculation;

  const calculation = {
    calculation: round.calculationType as "average" | "median" | "sum",
    threshold: (round.calculationConfig as { threshold: number })?.threshold,
  };
  // Fetch the ballots
  const ballots = await db.ballot.findMany({
    where: { roundId, publishedAt: { not: null } },
    select: { voterId: true, votes: true },
  });

  const projects = calculateVotes(
    ballots as unknown as { voterId: string; votes: Vote[] }[],
    calculation,
  );

  const averageVotes = 0;
  const totalVotes = Math.floor(
    Object.values(projects).reduce((sum, x) => sum + (x.votes ?? 0), 0),
  );
  const totalVoters = ballots.length;

  return { projects, totalVoters, totalVotes, averageVotes };
}
