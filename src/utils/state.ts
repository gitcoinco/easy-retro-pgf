import { isAfter } from "date-fns";
import { config } from "~/config";

type AppState = "APPLICATION" | "REVIEWING" | "VOTING" | "RESULTS";

export const getAppState = (): AppState => {
  const now = new Date();

  if (isAfter(config.registrationEndsAt, now)) return "APPLICATION";
  if (isAfter(config.reviewEndsAt, now)) return "REVIEWING";
  if (isAfter(config.votingEndsAt, now)) return "VOTING";

  return "RESULTS";
};
