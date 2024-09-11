import { type Round } from "@prisma/client";
import { db } from "~/server/db";

export async function fetchVoterLimits(
  round: Pick<Round, "id" | "maxVotesProject" | "maxVotesTotal">,
  voterId: string,
) {
  const voter = await db.voterConfig.findUnique({
    where: { voterId_roundId: { voterId, roundId: round.id } },
  });

  return (
    voter ?? {
      maxVotesTotal: round.maxVotesTotal,
      maxVotesProject: round.maxVotesProject,
    }
  );
}
