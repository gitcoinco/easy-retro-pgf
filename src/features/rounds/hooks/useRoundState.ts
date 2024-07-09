import { Round } from "@prisma/client";
import { isBefore } from "date-fns";
import { useMemo } from "react";
import { useCurrentRound } from "./useRound";

type AppState =
  | "APPLICATION"
  | "REVIEWING"
  | "VOTING"
  | "TALLYING"
  | "RESULTS"
  | null;

export function useRoundState() {
  const { data } = useCurrentRound();
  return useMemo(() => getState(data), [data]);
}

export const getState = (round?: Round | null): AppState => {
  const now = new Date();

  if (!round) return null;

  if (isBefore(now, round.reviewAt ?? now)) return "APPLICATION";
  if (isBefore(now, round.votingAt ?? now)) return "REVIEWING";
  if (isBefore(now, round.resultAt ?? now)) return "VOTING";
  if (isBefore(now, round.payoutAt ?? now)) return "TALLYING";

  return "RESULTS";
};
