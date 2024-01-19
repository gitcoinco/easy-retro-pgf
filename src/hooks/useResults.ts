import { config } from "~/config";
import { api } from "~/utils/api";
import { getAppState } from "~/utils/state";

export function useResults() {
  return api.results.stats.useQuery(undefined, {
    enabled: getAppState() === "RESULTS",
  });
}

const seed = 0;
export function useProjectsResults() {
  return api.results.projects.useInfiniteQuery(
    { limit: config.pageSize, seed },
    {
      getNextPageParam: (_, pages) => pages.length,
    },
  );
}

export function useProjectCount() {
  return api.projects.count.useQuery();
}

export function useProjectResults(id: string) {
  return api.results.project.useQuery(
    { id },
    { enabled: getAppState() === "RESULTS" },
  );
}
