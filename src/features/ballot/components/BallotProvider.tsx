"use client";
import { PropsWithChildren, createContext, useContext, useEffect } from "react";

import {
  useBallot,
  useRemoveAllocation,
  useSaveAllocation,
} from "~/features/ballot/hooks/useBallot";
import { useBallotEditor } from "../hooks/useBallotEditor";
import { BallotV2 } from "../types";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { RoundTypes } from "~/features/rounds/types";

type BallotContext = ReturnType<typeof useBallotEditor>;
const BallotContext = createContext(
  {} as BallotContext & {
    isPending: boolean;
    ballot?: BallotV2 | null;
  },
);

export function BallotProvider({ children }: PropsWithChildren) {
  const { data: ballot, isFetched, isPending } = useBallot();
  const save = useSaveAllocation();
  const remove = useRemoveAllocation();

  const round = useCurrentRound();

  // When Round type is impact, always use percetages (100)
  const [maxAllocation, allocationCap] =
    round.data?.type === RoundTypes.impact
      ? [100, 100]
      : [round.data?.maxVotesTotal ?? 0, round.data?.maxVotesProject ?? 0];

  const editor = useBallotEditor({
    maxAllocation,
    allocationCap,
    onUpdate: save.mutate,
    onRemove: remove.mutate,
  });

  useEffect(() => {
    isFetched && editor.reset(ballot?.allocations);
  }, [isFetched]); // Only trigger when isFetched is changed

  const value = { ballot, isPending, ...editor };

  return (
    <BallotContext.Provider value={value}>{children}</BallotContext.Provider>
  );
}

export function useBallotContext() {
  return useContext(BallotContext);
}
