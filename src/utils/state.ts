import { isAfter } from "date-fns";
import { config } from "~/config";
import { useMaci } from "~/contexts/Maci";
import { EAppState } from "./types";

export const getAppState = (): EAppState => {
  const now = new Date();
  const { isLoading, votingEndsAt, pollData, tallyData } = useMaci();

  if (isLoading) {
    return EAppState.LOADING;
  }

  if (isAfter(config.registrationEndsAt, now)) return EAppState.APPLICATION;
  if (isAfter(config.reviewEndsAt, now)) return EAppState.REVIEWING;
  if (isAfter(votingEndsAt, now)) return EAppState.VOTING;
  if (!pollData?.isStateAqMerged || !tallyData) return EAppState.TALLYING;

  return EAppState.RESULTS;
};
