import type { Round } from "@prisma/client";
import type { Attestation } from "~/utils/fetchAttestations";
import { getApplicationStatus } from "./getApplicationStatus";
import type { ApplicationStatus } from "../types";

/**
 * Retrieves application status for multiple projects in a given round.
 *
 * @param round - The round for which to fetch application statuses.
 * @param projectAttestations - Array of project attestations.
 * @returns A promise that resolves to an object mapping project IDs to their application statuses.
 */
export const getApplicationsStatusMapById = async ({
  round,
  projectAttestations,
}: {
  round: Round;
  projectAttestations: Attestation[];
}): Promise<Record<string, ApplicationStatus>> => {
  const statusByProjectId: Record<string, ApplicationStatus> = {};
  await Promise.all(
    projectAttestations.map(async ({ id: projectId }) => {
      const { status } = await getApplicationStatus({
        round,
        projectId,
      });

      statusByProjectId[projectId] = status;
    }),
  );

  return statusByProjectId;
};
