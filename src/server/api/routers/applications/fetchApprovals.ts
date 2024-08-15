import {
  createDataFilter,
  type AttestationFetcher,
} from "~/utils/fetchAttestations";

export async function fetchApprovals({
  attestationFetcher,
  admins,
  projectIds,
  roundId,
}: {
  attestationFetcher: AttestationFetcher;
  admins: string[];
  projectIds?: string[];
  roundId: string;
}) {
  return attestationFetcher(["approval"], {
    where: {
      attester: { in: admins },
      refUID: projectIds ? { in: projectIds } : undefined,
      AND: [
        createDataFilter("type", "bytes32", "application"),
        createDataFilter("round", "bytes32", roundId),
      ],
    },
  });
}
