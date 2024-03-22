import { isAfter, isBefore } from "date-fns";
import { config } from "~/config";

type AppState = "APPLICATION" | "REVIEWING" | "VOTING" | "RESULTS" | "TALLYING";

export const getAppState = (): AppState => {
  const now = new Date();

  if (isAfter(config.registrationEndsAt, now)) return "APPLICATION";
  if (isAfter(config.reviewEndsAt, now)) return "REVIEWING";
  if (isAfter(config.votingEndsAt, now)) return "VOTING";
  if (isBefore(now, config.resultsAt)) return "TALLYING";

  return "RESULTS";
};
