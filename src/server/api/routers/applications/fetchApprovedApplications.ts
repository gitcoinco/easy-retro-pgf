import { type AttestationFetcher } from "~/utils/fetchAttestations";
import { fetchApplications } from "../applications/fetchApplications";
import { fetchApprovals } from "../applications/fetchApprovals";

export async function fetchApprovedApplications({
  attestationFetcher,
  admins,
  roundId,
}: {
  attestationFetcher: AttestationFetcher;
  admins: string[];
  projectIds?: string[];
  roundId: string;
}) {
  const approvedApplicationsIds = await fetchApprovals({
    attestationFetcher,
    admins,
    roundId,
  }).then((approvedApplicationsAttestations) =>
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
