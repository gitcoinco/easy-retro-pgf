import { config } from "~/config";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";
import { getAppState } from "~/utils/state";

export function useResults() {
  return api.results.votes.useQuery();
}

const seed = 0;
export function useProjectsResults() {
  return api.results.projects.useInfiniteQuery(
    { limit: config.pageSize, seed },
    { getNextPageParam: (_, pages) => pages.length },
  );
}

export function useProjectResults(id: string) {
  const query = api.results.votes.useQuery(undefined, {
    enabled: getAppState() === "RESULTS",
  });
  const project = query.data?.projects?.[id];
  return {
    ...query,
    data: project?.votes ?? 0,
  };
}
