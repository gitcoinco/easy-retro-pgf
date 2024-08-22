import { createDataFilter } from "~/utils/fetchAttestations/filters";
import type {
  AttestationFetcher,
  PartialRound,
} from "~/utils/fetchAttestations/types";

export async function fetchProfiles({
  attestationFetcher,
  round,
  recipients,
}: {
  attestationFetcher: AttestationFetcher;
  round: PartialRound;
  recipients: string[];
}) {
  const { id: roundId, network } = round;
  if (!roundId) throw new Error("Round ID must be defined");
  if (!network) throw new Error("Round network must be configured");

  const profiles = await attestationFetcher(["metadata"], {
    where: {
      recipient: { in: recipients },
      AND: [
        createDataFilter("type", "bytes32", "profile"),
        createDataFilter("round", "bytes32", roundId),
      ],
    },
  });

  return profiles;
}
