"use client";
import { useCallback, useMemo, useState } from "react";

import { useBallotContext } from "../components/provider";
import { Allocation } from "../types";
import {
  createSortFn,
  useBallotFilter,
} from "~/features/metrics/hooks/useFilter";
import { useMetrics } from "~/features/metrics/hooks/useMetrics";

export type BallotState = Record<string, { amount: number; locked: boolean }>;

export function useBallotEditor({
  onRemove,
  onUpdate,
}: {
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
      // Must be between 0 - 100
      const amount = Math.max(Math.min(value || 0, 100), 0);
      const locked = !unlock;
      const _state = calculateBalancedAmounts({
        ...s,
        [id]: { ...s[id], amount, locked },
      });

      onUpdate?.({ id, amount: 0, locked: false, ..._state[id] });

      return _state;
    });
  };
  const inc = (id: string) => set(id, Math.floor((state[id]?.amount ?? 0) + 1));
  const dec = (id: string) => set(id, Math.ceil((state[id]?.amount ?? 0) - 1));
  const add = (id: string, amount = 0) => {
    const _state = calculateBalancedAmounts({
      ...state,
      [id]: { ...state[id], amount, locked: false },
    });

    set(id, _state[id]?.amount ?? 0, true);
  };
  const remove = (id: string) =>
    setState((s) => {
      const { [id]: _remove, ..._state } = s;
      onRemove?.({ id });
      return calculateBalancedAmounts(_state);
    });
  const reset = setInitialState;

  return { set, inc, dec, add, remove, reset, state };
}

function calculateBalancedAmounts(state: BallotState): BallotState {
  // Autobalance non-locked fields
  const locked = Object.entries(state).filter(([_, m]) => m.locked);
  const nonLocked = Object.entries(state).filter(([_, m]) => !m.locked);

  const amountToBalance =
    100 - locked.reduce((sum, [_, m]) => sum + m.amount, 0);

  return Object.fromEntries(
    Object.entries(state).map(([id, { amount, locked }]) => [
      id,
      {
        amount: locked
          ? amount
          : amountToBalance
            ? amountToBalance / nonLocked.length
            : 0,
        locked,
      },
    ]),
  );
}

export function useSortBallot(initialState: BallotState) {
  const { state } = useBallotContext();
  const { data: metrics, isPending } = useMetrics();
  const [filter, setFilter] = useBallotFilter();

  const sorted = useMemo(
    () =>
      metrics
        ?.map((m) => ({ ...m, ...state[m.id] }))
        .sort(createSortFn({ order: filter.order, sort: filter.sort }))
        .map((m) => m?.id ?? "")
        .filter(Boolean) ?? [],
    [filter, metrics], // Don't put state here because we don't want to sort when allocation changes
  );

  return {
    filter,
    sorted,
    isPending,
    setFilter,
  };
}
