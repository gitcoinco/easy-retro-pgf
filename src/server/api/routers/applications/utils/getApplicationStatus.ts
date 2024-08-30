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
    noCache: true,
  });

  const lastAttestation = approvals.at(-1);

  if (lastAttestation) {
    return {
      status: lastAttestation.revoked ? "rejected" : "approved",
      attestations: withAttestations ? approvals : undefined,
    };
  }

  return { status: "pending" };
}
