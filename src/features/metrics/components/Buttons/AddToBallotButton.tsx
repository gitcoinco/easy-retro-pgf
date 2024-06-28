"use client";
import { Check, Plus } from "lucide-react";
import { Button } from "./Button";

const state: { [key: string]: boolean } = {};

const useBallotContext = () => ({
  add: (id: string) => {
    console.log("Added to ballot:", id);
  },
  remove: (id: string) => {
    console.log("Removed from ballot:", id);
  },
  state,
  isPending: false,
});

export function AddToBallotButton({
  id = "",
  variant = "secondary",
}: {
  id?: string;
  variant?: "default" | "secondary" | "destructive";
}) {
  const { add, remove, state, isPending } = useBallotContext();
  if (isPending)
    return (
      <Button disabled variant="secondary" isLoading>
        Loading
      </Button>
    );
  const isAdded = state[id];
  if (isAdded) {
    return (
      <Button
        icon={Check}
        variant="success"
        onClick={() => {
          remove(id);
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
        add(id);
      }}
    >
      Add to ballot
    </Button>
  );
}
