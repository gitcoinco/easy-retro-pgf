import { isBefore } from "date-fns";
import { config } from "~/config";

type AppState = "APPLICATION" | "REVIEWING" | "VOTING" | "RESULTS";

export const getAppState = (): AppState => {
  const now = new Date();

  if (isBefore(config.registrationEndsAt, now)) return "APPLICATION";
  if (isBefore(config.reviewEndsAt, now)) return "REVIEWING";
  if (isBefore(config.votingEndsAt, now)) return "VOTING";

  return "RESULTS";
};
