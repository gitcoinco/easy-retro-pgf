import { type IGetPollData } from "maci-cli/sdk";

import { config } from "~/config";
import { api } from "~/utils/api";
import { getAppState } from "~/utils/state";
import { EAppState } from "~/utils/types";

export function useResults(pollData?: IGetPollData) {
  const appState = getAppState();

  return api.results.votes.useQuery(
    { pollId: pollData?.id.toString() },
    { enabled: appState === EAppState.RESULTS },
  );
}

const seed = 0;
export function useProjectsResults(pollData?: IGetPollData) {
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

export function useProjectResults(id: string, pollData?: IGetPollData) {
  const appState = getAppState();

  return api.results.project.useQuery(
    { id, pollId: pollData?.id.toString() },
    { enabled: appState === EAppState.RESULTS },
  );
}
