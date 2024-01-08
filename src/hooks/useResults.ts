import { api } from "~/utils/api";
import { getAppState } from "~/utils/state";

export function useResults() {
  return api.ballot.results.useQuery(undefined, {
    enabled: getAppState() === "RESULTS",
  });
}
