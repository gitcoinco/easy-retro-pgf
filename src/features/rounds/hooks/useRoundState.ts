import type { Round } from "@prisma/client";
import { isAfter, isBefore } from "date-fns";
import { useMemo } from "react";
import { useCurrentRound } from "./useRound";

type AppState =
  | "APPLICATION"
  | "REVIEWING"
  | "VOTING"
  | "RESULTS"
  | "TALLYING"
  | null;

export function useRoundState() {
  const { data } = useCurrentRound();
  return useMemo(() => getState(data), [data]);
}

const getState = (round?: Round | null): AppState => {
  const now = new Date();

  console.log(round);
  if (!round) return null;
  if (isAfter(round.registrationEndsAt ?? now, now)) return "APPLICATION";
  if (isAfter(round.reviewEndsAt ?? now, now)) return "REVIEWING";
  if (isAfter(round.votingEndsAt ?? now, now)) return "VOTING";
  if (isAfter(round.resultsAt ?? now, now)) return "TALLYING";

  return "RESULTS";
};
