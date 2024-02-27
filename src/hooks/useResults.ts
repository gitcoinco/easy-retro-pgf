import { config } from "~/config";
import { api } from "~/utils/api";
import { getAppState } from "~/utils/state";

export function useResults() {
  const appState = getAppState();

  return api.results.stats.useQuery(undefined, {
    enabled: appState === "RESULTS",
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
  const appState = getAppState();

  return api.results.project.useQuery(
    { id },
    { enabled: appState === "RESULTS" },
  );
}

