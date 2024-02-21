import { isAfter } from "date-fns";
import { config } from "~/config";
import { useMaciPoll } from "~/hooks/useMaciPoll";

type AppState = "LOADING" | "APPLICATION" | "REVIEWING" | "VOTING" | "RESULTS" | "TALLYING";

export const getAppState = (): AppState => {
  const now = new Date();
  const { isLoading, votingEndsAt } = useMaciPoll();

  if (isLoading) {
    return "LOADING";
  }

  if (isAfter(config.registrationEndsAt, now)) return "APPLICATION";
  if (isAfter(config.reviewEndsAt, now)) return "REVIEWING";
  if (isAfter(votingEndsAt, now)) return "VOTING";
  if (isAfter(config.resultsAt, now)) return "TALLYING";

  return "RESULTS";
};
