import { fetchImpactMetrics } from "~/utils/fetchMetrics";
import type { ImpactMetricsQuery } from "~/utils/fetchMetrics/types";
import { mockedApprovedProjects } from "./mocks";

type ProjectMetrics = Record<string, string | number>;
type ProjectIdToMetricsMap = Record<string, ProjectMetrics>;

export async function getProjects({
  projectIds,
  metricIds,
}: {
  projectIds: string[];
  metricIds: string[];
}): Promise<ProjectIdToMetricsMap> {
  const approvedProjects = mockedApprovedProjects;

  // Temporary mapping to OSO example projects
  const tempProjectMap: Record<string, string> = Object.fromEntries(
    projectIds.map((id, i) => [
      approvedProjects[i % approvedProjects.length] ?? "",
      id,
    ]),
  );

  const query: ImpactMetricsQuery = {
    where: {
      project_name: { _in: Object.keys(tempProjectMap) },
      event_source: { _eq: "BASE" },
    },
    orderBy: [{ active_contract_count_90_days: "desc" }],
    limit: 300,
    offset: 0,
  };

  const projects = await fetchImpactMetrics(query, metricIds);

  const projectMetricsMap: ProjectIdToMetricsMap = Object.fromEntries(
    projects.map((project) => {
      // Replace with correct projectId
      const projectId = tempProjectMap[project.project_name] ?? "";
      const metrics = metricIds.reduce<ProjectMetrics>(
        (acc, metricId) => ({
          ...acc,
          [metricId]: project[metricId as keyof typeof project],
        }),
        {},
      );
      return [projectId, metrics];
    }),
  );

  return projectMetricsMap;
}
