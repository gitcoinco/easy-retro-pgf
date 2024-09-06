import type { Round } from "@prisma/client";
import type { SortOrder } from "~/features/filter/types";
import {
  type Attestation,
  createAttestationFetcher,
  createDataFilter,
} from "../fetchAttestations";

export const fetchApplicationAttestations = async ({
  round,
  orderBy,
  take,
  skip,
}: {
  round: Round;
  orderBy?: Array<Record<string, SortOrder>>;
  take?: number;
  skip?: number;
}): Promise<Attestation[]> => {
  const attestationFetcher = createAttestationFetcher({ round });

  const applicationAttestations = await attestationFetcher(
    ["metadata"],
    {
      where: {
        AND: [
          createDataFilter("type", "bytes32", "application"),
          createDataFilter("round", "bytes32", round.id),
        ],
      },
      take,
      skip,
      orderBy,
    },
    ["id", "decodedDataJson", "recipient"],
  );

  return applicationAttestations;
};
