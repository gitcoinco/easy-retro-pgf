import { useMemo, useState } from "react";
import { useBallot } from "~/contexts/Ballot";
import { useMaci } from "~/contexts/Maci";

export function useSelectProjects() {
  const { addToBallot, ballotContains } = useBallot();
  const { pollId } = useMaci();

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
      addToBallot(toAdd, pollId);
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
      Boolean(ballotContains(id)) ? 2 : selected[id] ? 1 : 0,
  };
}
