"use client";
import { Check, Plus } from "lucide-react";
import { Button } from "~/components/ui/Button";
import {
  ballotContains,
  useAddToBallot,
  useBallot,
  useRemoveFromBallot,
} from "~/features/ballot/hooks/useBallot";

const state: { [key: string]: boolean } = {};

export function AddToBallotButton({
  id = "",
  variant = "secondary",
}: {
  id?: string;
  variant?: "default" | "secondary" | "primary";
}) {
  const ballot = useBallot();
  const add = useAddToBallot();
  const remove = useRemoveFromBallot();
  const isAdded = ballotContains(id, ballot.data);
  const isPending = add.isPending || remove.isPending;

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
        variant="success"
        onClick={() => {
          remove.mutate(id);
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
        add.mutate([{ projectId: id, amount: 0 }]);
      }}
    >
      Add to ballot
    </Button>
  );
}
