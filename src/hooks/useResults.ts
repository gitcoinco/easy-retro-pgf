import { config } from "~/config";
import { useIsShowActualVotes } from "~/features/rounds/hooks/useIsShowActualVotes";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import { api } from "~/utils/api";

export function useResults() {
  return api.results.results.useQuery();
}

const seed = 0;
export function useProjectsResults() {
  return api.results.projects.useInfiniteQuery(
    { limit: config.pageSize, seed },
    { getNextPageParam: (_, pages) => pages.length },
  );
}

export function useProjectResults(id: string) {
  const isShowActualVotes = useIsShowActualVotes();
  const query = api.results.results.useQuery(undefined, {
    enabled: useRoundState() === "RESULTS",
  });
  const project = query.data?.projects?.[id];

  const votes = isShowActualVotes ? project?.actualVotes : project?.votes;

  return {
    ...query,
    data: votes ?? 0,
  };
}

export function useAllProjectsResults() {
  return api.results.allProjects.useQuery();
}
