import { useMemo, useState } from "react";
import {
  useBallot,
  useSaveAllocation,
} from "~/features/ballotV2/hooks/useBallot";

export function useSelectProjects() {
  const add = useSaveAllocation();
  const { data: ballot, isPending } = useBallot();

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toAdd = useMemo(
    () =>
      Object.keys(selected)
        .filter((id) => selected[id])
        .map((id) => ({ id, amount: 0 })),
    [selected],
  );

  return {
    count: toAdd.length,
    isPending: isPending || add.isPending,
    add: () => {
      toAdd.map((a) => add.mutate(a));
      setSelected({});
    },
    reset: () => setSelected({}),
    toggle: (id: string) => {
      if (!id) return;
      selected[id]
        ? setSelected((s) => ({ ...s, [id]: false }))
        : setSelected((s) => ({ ...s, [id]: true }));
    },
    getState: (id: string) =>
      Boolean(ballot?.allocations.map((a) => a.id).includes(id))
        ? 2
        : selected[id]
          ? 1
          : 0,
  };
}
