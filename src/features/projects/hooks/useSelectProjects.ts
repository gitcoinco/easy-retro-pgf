import { useMemo, useState } from "react";
import { ballotContains, useMaci } from "~/contexts/Maci";

export function useSelectProjects() {

  const { useAddToBallot, ballot } = useMaci();

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
    // isLoading: add.isPending,
    add: () => {
      useAddToBallot(toAdd);
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
