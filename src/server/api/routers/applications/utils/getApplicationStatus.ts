import type { Round } from "@prisma/client";
import { fetchApprovals } from "./fetchApprovals";
import type { ApplicationStatus } from "../types";
import type { Attestation } from "~/utils/fetchAttestations";

export async function getApplicationStatus({
  round,
  projectId,
  withAttestation = false,
}: {
  round: Round;
  projectId: string;
  withAttestation?: boolean;
}): Promise<{ status: ApplicationStatus; attestation?: Attestation }> {
  const approvals = await fetchApprovals({
    round,
    projectIds: [projectId],
    includeRevoked: true,
    expirationTime: Date.now(),
    onlyLastAttestation: true,
  });

  const lastAttestation = approvals[0];

  if (!lastAttestation) return { status: "pending" };

  const status = lastAttestation?.revoked ? "rejected" : "approved";

  return {
    status,
    attestation: withAttestation ? lastAttestation : undefined,
  };
}
