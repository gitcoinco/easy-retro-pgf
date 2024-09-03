import type { Round } from "@prisma/client";
import { fetchApprovals } from "./fetchApprovals";
import type { ApplicationStatus } from "../types";
import type { Attestation } from "~/utils/fetchAttestations";

export async function getApplicationStatus({
  round,
  projectId,
  withAttestations = false,
}: {
  round: Round;
  projectId: string;
  withAttestations?: boolean;
}): Promise<{ status: ApplicationStatus; attestations?: Attestation[] }> {
  const approvals = await fetchApprovals({
    round,
    projectIds: [projectId],
    includeRevoked: true,
    expirationTime: Date.now(),
  });

  const lastAttestation = approvals[0];

  if (!lastAttestation) return { status: "pending" };

  const status = lastAttestation?.revoked ? "rejected" : "approved";

  return {
    status,
    attestations: withAttestations ? approvals : undefined,
  };
}
