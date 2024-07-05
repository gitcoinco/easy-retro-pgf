"use client";
import { useCallback, useMemo, useState } from "react";

import { useBallotContext } from "../components/provider";
import { Allocation } from "../types";
import {
  createSortFn,
  useBallotFilter,
} from "~/features/metrics/hooks/useFilter";

export type BallotState = Record<string, { amount: number; locked: boolean }>;

export function useBallotEditor({
  maxAllocation,
  allocationCap,
  onRemove,
  onUpdate,
}: {
  maxAllocation: number;
  allocationCap: number;
  onRemove?: ({ id }: { id: string }) => void;
  onUpdate?: (amount: Allocation) => void;
}) {
  const [state, setState] = useState<BallotState>({});

  const setInitialState = useCallback(
    (allocations: Allocation[] = []) => {
      const ballot: BallotState = Object.fromEntries(
        allocations.map((m) => [
          m.id,
          { amount: +m.amount, locked: Boolean(m.locked) },
        ]),
      );
      setState(ballot);
    },
    [setState],
  );

  const set = (id: string, value: number, unlock: boolean = false) => {
    setState((s) => {
      const amount = value;
      const locked = !unlock;
      const _state = calculateBalancedAmounts(
        {
          ...s,
          [id]: { ...s[id], amount, locked },
        },
        maxAllocation,
        allocationCap,
      );

      onUpdate?.({ id, amount: 0, locked: false, ..._state[id] });

      return _state;
    });
  };
  const inc = (id: string) => set(id, Math.floor((state[id]?.amount ?? 0) + 1));
  const dec = (id: string) => set(id, Math.ceil((state[id]?.amount ?? 0) - 1));
  const add = (id: string, amount = 0) => {
    const _state = calculateBalancedAmounts(
      {
        ...state,
        [id]: { ...state[id], amount, locked: false },
      },
      maxAllocation,
      allocationCap,
    );

    set(id, _state[id]?.amount ?? 0, true);
  };
  const remove = (id: string) =>
    setState((s) => {
      const { [id]: _remove, ..._state } = s;
      onRemove?.({ id });
      return calculateBalancedAmounts(_state, maxAllocation, allocationCap);
    });
  const reset = setInitialState;

  return { set, inc, dec, add, remove, reset, state };
}

export function calculateBalancedAllocations(
  allocations: Allocation[],
  maxAllocation: number,
  allocationCap: number,
) {
  const locked = allocations.filter((alloc) => alloc.locked);
  const lockedAmount = locked.reduce((sum, x) => sum + Number(x.amount), 0);

  const unlocked = allocations
    .filter((alloc) => !alloc.locked)
    .map((alloc, i, arr) => ({
      ...alloc,
      amount: Math.min(
        allocationCap,
        (maxAllocation - lockedAmount) / arr.length,
      ),
    }));

  return [...locked, ...unlocked];
}

function calculateBalancedAmounts(
  state: BallotState,
  maxAllocation: number,
  allocationCap: number,
): BallotState {
  const updates = calculateBalancedAllocations(
    Object.entries(state).map(([id, alloc]) => ({ id, ...alloc })),
    maxAllocation,
    allocationCap,
  );

  return Object.fromEntries(updates.map((alloc) => [alloc.id, alloc]));
}
export function useSortBallot(list: { id: string }[] = []) {
  const { state } = useBallotContext();
  const [filter, setFilter] = useBallotFilter();

  const sorted = useMemo(
    () =>
      list
        ?.map((m) => ({ ...m, ...state[m.id] }))
        .sort(createSortFn({ order: filter.order, sort: filter.sort }))
        .map((m) => m?.id ?? "")
        .filter(Boolean) ?? [],
    [filter, list], // Don't put state here because we don't want to sort when allocation changes
  );

  return {
    filter,
    sorted,
    setFilter,
  };
}
