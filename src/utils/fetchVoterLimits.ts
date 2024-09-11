import { type Round } from "@prisma/client";
import { prisma } from "~/server/db";

export async function fetchVoterLimits(round: Round, voterId: string) {
  const voter = await prisma.voter.findUnique({
    where: { voterId_roundId: { voterId, roundId: round.id } },
  });

  return (
    voter ?? {
      maxVotesTotal: round.maxVotesTotal,
      maxVotesProject: round.maxVotesProject,
    }
  );
}
