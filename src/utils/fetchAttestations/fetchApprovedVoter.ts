import type { Round } from "@prisma/client";
import { createAttestationFetcher } from "./createAttestationFetcher";
import { createDataFilter } from "./filters";

export async function fetchApprovedVoter(round: Round, address: string) {
  // if (config.skipApprovedVoterCheck) return true;
  if (!round.id) throw new Error("Round ID must be defined");
  if (!round.network) throw new Error("Round network must be configured");
  return createAttestationFetcher({ round })(["approval"], {
    where: {
      recipient: { equals: address },
      AND: [
        createDataFilter("type", "bytes32", "voter"),
        createDataFilter("round", "bytes32", round.id),
      ],
    },
  }).then((attestations) => attestations.length);
}
