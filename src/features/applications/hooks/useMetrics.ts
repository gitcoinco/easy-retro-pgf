import { api } from "~/utils/api";

export function useProjectsMetrics(projectName: string) {
  return api.metrics.projectMetrics.useQuery(projectName);
}
