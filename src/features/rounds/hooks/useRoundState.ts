import type { Round } from "@prisma/client";
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

const getState = (round?: Round | null): AppState => {
  const now = new Date();

  if (!round) return null;
  if (isBefore(now, round.startsAt ?? now)) return "APPLICATION";
  if (isBefore(now, round.reviewAt ?? now)) return "REVIEWING";
  if (isBefore(now, round.votingAt ?? now)) return "VOTING";
  if (isBefore(now, round.resultAt ?? now)) return "TALLYING";

  return "RESULTS";
};
