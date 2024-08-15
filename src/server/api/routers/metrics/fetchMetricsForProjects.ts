import {
  type MetricWithProjects,
  type OSOMetric,
  fetchImpactMetrics,
  mapMetrics,
} from "~/utils/fetchMetrics";
import type { ImpactMetricsQuery } from "~/utils/fetchMetrics/types";
import { mockedApprovedProjects } from "./mocks";

export async function fetchMetricsForProjects({
  metricIds,
}: {
  metricIds: string[];
}): Promise<MetricWithProjects[]> {
  const approvedProjects = mockedApprovedProjects;

  const query: ImpactMetricsQuery = {
    where: {
      project_name: { _in: approvedProjects },
      event_source: { _eq: "BASE" },
    },
    orderBy: [{ active_contract_count_90_days: "desc" }],
    limit: 300,
    offset: 0,
  };

  const projects = await fetchImpactMetrics(query, metricIds);

  return mapMetrics(projects, metricIds as (keyof OSOMetric)[]);
}
