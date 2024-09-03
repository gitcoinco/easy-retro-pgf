import type { Round } from "@prisma/client";
import { type AttestationFetcher } from "~/utils/fetchAttestations";
import { fetchApplications } from "./fetchApplications";
import { fetchApprovals } from "./fetchApprovals";

export async function fetchApprovedApplications({
  attestationFetcher,
  round,
}: {
  attestationFetcher: AttestationFetcher;
  round: Round;
}) {
  const { id: roundId } = round;

  const approvedApplicationsIds = await fetchApprovals({ round }).then(
    (approvedApplicationsAttestations) =>
      approvedApplicationsAttestations.map((attestation) => attestation.refUID),
  );

  const applications = await fetchApplications({
    attestationFetcher,
    roundId,
  });

  const approvedApplications = applications.filter((application) =>
    approvedApplicationsIds.includes(application.id),
  );

  return approvedApplications;
}
