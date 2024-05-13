import { useMemo, useState } from "react";
import {
  ballotContains,
  useAddToBallot,
  useBallot,
} from "~/features/ballot/hooks/useBallot";

export function useSelectProjects() {
  const add = useAddToBallot();
  const { data: ballot, isLoading } = useBallot();

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toAdd = useMemo(
    () =>
      Object.keys(selected)
        .filter((id) => selected[id])
        .map((projectId) => ({ projectId, amount: 0 })),
    [selected],
  );

  return {
    count: toAdd.length,
    isLoading: isLoading || add.isPending,
    add: () => {
      add.mutate(toAdd);
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
      Boolean(ballotContains(id, ballot)) ? 2 : selected[id] ? 1 : 0,
  };
}
