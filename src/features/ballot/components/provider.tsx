"use client";
import { PropsWithChildren, createContext, useContext, useEffect } from "react";

import {
  useBallot,
  useRemoveAllocation,
  useSaveAllocation,
} from "~/features/ballotV2/hooks/useBallot";
import { useBallotEditor } from "../hooks/useBallotEditor";
import { BallotV2 } from "../types";

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

  const editor = useBallotEditor({
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
