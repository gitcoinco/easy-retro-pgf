import { config } from "~/config";
import { api } from "~/utils/api";
import { getAppState } from "~/utils/state";
import { useMaciPoll } from "./useMaciPoll";

export function useResults() {
  const appState = getAppState();
  const { pollData } = useMaciPoll();

  return api.results.votes.useQuery(
    { pollId: pollData?.id.toString() },
    { enabled: appState === "RESULTS" },
  );
}

const seed = 0;
export function useProjectsResults() {
  const { pollData } = useMaciPoll();

  return api.results.projects.useInfiniteQuery(
    { limit: config.pageSize, seed, pollId: pollData?.id.toString() },
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
  const { pollData } = useMaciPoll();

  return api.results.project.useQuery(
    { id, pollId: pollData?.id.toString() },
    { enabled: appState === "RESULTS" },
  );
}