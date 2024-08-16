import { createAttestationFetcher } from "./createAttestationFetcher";
import { createDataFilter } from "./filters";
import type { PartialRound } from "./types";

export async function fetchProfiles(round: PartialRound, recipients: string[]) {
  if (!round.id) throw new Error("Round ID must be defined");
  if (!round.network) throw new Error("Round network must be configured");

  return createAttestationFetcher(round)(["metadata"], {
    where: {
      recipient: { in: recipients },
      ...createDataFilter("type", "bytes32", "profile"),
    },
  });
}
