import {
  fetchImpactMetricsFromCSV,
  mapMetrics,
  type MetricWithProjects,
} from "~/utils/fetchMetrics";
import type { MetricId } from "~/types/metrics";
import { mockedApprovedProjects } from "../mocks";
import { fetchApprovedApplications } from "../../applications/utils";
import type { AttestationFetcher } from "~/utils/fetchAttestations";

export async function fetchMetricsForProjects({
  admins,
  attestationFetcher,
  metricIds,
  roundId,
}: {
  admins: string[];
  attestationFetcher: AttestationFetcher;
  metricIds: string[];
  roundId: string;
}): Promise<MetricWithProjects[]> {
  const approvedApplications = await fetchApprovedApplications({
    attestationFetcher,
    admins,
    roundId,
  });

  // const approvedProjects = mockedApprovedProjects; // For testing
  const approvedProjects = approvedApplications.map(
    (application) => application.name,
  );

  const metricsByProject = await fetchImpactMetricsFromCSV({
    projects: approvedProjects,
    metrics: metricIds as MetricId[],
  });

  const mappedMetrics = mapMetrics(metricsByProject, metricIds as MetricId[]);

  return mappedMetrics;
}
