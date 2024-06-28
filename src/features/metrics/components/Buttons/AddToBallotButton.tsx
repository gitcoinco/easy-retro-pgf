"use client";
import { Check, Plus } from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";

const state: { [key: string]: boolean } = {};

const useBallotContext = () => ({
  add: undefined,
  remove: undefined,
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
  const [isAdded, setIsAdded] = useState(false);

  const {
    add = (id: string) => setIsAdded(true),
    remove = (id: string) => setIsAdded(false),
    state,
    isPending,
  } = useBallotContext();

  if (isPending)
    return (
      <Button disabled variant="secondary" isLoading>
        Loading
      </Button>
    );
  // const isAdded = state[id];
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
