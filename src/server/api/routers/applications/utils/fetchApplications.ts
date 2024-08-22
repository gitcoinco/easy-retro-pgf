import {
  createDataFilter,
  type AttestationFetcher,
} from "~/utils/fetchAttestations";

export async function fetchApplications({
  attestationFetcher,
  roundId,
}: {
  attestationFetcher: AttestationFetcher;
  roundId: string;
}) {
  return attestationFetcher(["metadata"], {
    orderBy: [{ time: "desc" }],
    where: {
      AND: [
        createDataFilter("type", "bytes32", "application"),
        createDataFilter("round", "bytes32", roundId),
      ],
    },
  });
}
