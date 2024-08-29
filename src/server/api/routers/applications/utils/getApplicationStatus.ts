import type { Round } from "@prisma/client";
import { fetchApprovals } from "./fetchApprovals";
import type { ApplicationStatus } from "../types";

export async function getApplicationStatus({
  round,
  projectId,
}: {
  round: Round;
  projectId: string;
}): Promise<{ status: ApplicationStatus }> {
  const approvals = await fetchApprovals({
    round,
    projectIds: [projectId],
    includeRevoked: true,
    noCache: true,
  });

  const lastAttestation = approvals.at(-1);

  if (lastAttestation) {
    return { status: lastAttestation.revoked ? "rejected" : "approved" };
  }

  return { status: "pending" };
}
