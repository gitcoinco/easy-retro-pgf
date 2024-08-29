import type { Round } from "@prisma/client";
import {
  fetchImpactMetricsFromCSV,
  mapMetrics,
  type MetricWithProjects,
} from "~/utils/fetchMetrics";
import type { MetricId } from "~/types/metrics";
import { fetchApprovedApplications } from "../../applications/utils";
import type { AttestationFetcher } from "~/utils/fetchAttestations";

export async function fetchMetricsForProjects({
  attestationFetcher,
  metricIds,
  round,
}: {
  attestationFetcher: AttestationFetcher;
  metricIds: string[];
  round: Round;
}): Promise<MetricWithProjects[]> {
  const approvedApplications = await fetchApprovedApplications({
    attestationFetcher,
    round,
  });

  const approvedProjects = approvedApplications.map(
    (application) => application.name,
  );

  if (approvedProjects.length === 0) {
    return [];
  }

  const metricsByProject = await fetchImpactMetricsFromCSV({
    projects: approvedProjects,
    metrics: metricIds as MetricId[],
  });

  const mappedMetrics = mapMetrics(metricsByProject, metricIds as MetricId[]);

  return mappedMetrics;
}
