"use client";
import { Check, Plus } from "lucide-react";
import { Button } from "~/components/ui/Button";
import {
  useBallot,
  useRemoveAllocation,
  useSaveAllocation,
} from "~/features/ballot/hooks/useBallot";
import { RoundTypes } from "~/features/rounds/types";

export function AddToBallotButton({
  id = "",
  variant = "secondary",
}: {
  id?: string;
  variant?: "default" | "secondary" | "primary";
}) {
  const ballot = useBallot();
  const add = useSaveAllocation();
  const remove = useRemoveAllocation();

  const isPending = ballot.isPending || add.isPending || remove.isPending;
  const isAdded = ballot.data?.allocations.find((a) => a.id === id);
  if (isPending)
    return (
      <Button disabled variant="secondary" isLoading>
        Loading
      </Button>
    );
  if (isAdded) {
    return (
      <Button
        icon={Check}
        variant="primary"
        onClick={() => {
          remove.mutate({ id });
        }}
      >
        Added
      </Button>
    );
  }
  return (
    <Button
      disabled={!id}
      icon={Plus}
      variant={variant}
      onClick={() => {
        add.mutate({ id, amount: 0, locked: false });
      }}
    >
      Add to ballot
    </Button>
  );
}
