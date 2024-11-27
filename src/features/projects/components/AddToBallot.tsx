import { useState } from "react";
import { z } from "zod";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { useFormContext } from "react-hook-form";
import { Check } from "lucide-react";

import { Button, IconButton } from "~/components/ui/Button";
import { formatNumber } from "~/utils/formatNumber";
import { Dialog } from "~/components/ui/Dialog";
import { Form } from "~/components/ui/Form";
import {
  ballotContains,
  useAddToBallot,
  useBallot,
  useRemoveFromBallot,
  sumBallot,
} from "~/features/ballot/hooks/useBallot";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { AllocationInput } from "~/components/AllocationInput";
import { Alert } from "~/components/ui/Alert";

type Props = { id?: string; name?: string };

const QuadraticVotingMessageMessage = "Voting results are calculated using a quadratic formula. This method amplifies the impact of distributing votes across multiple projects, rather than concentrating them on a few. Please consider this when casting your votes."


export const QuadraticVotingMessage = () => <div className="flex items-center gap-2">
  <div className="text-lg">
    {QuadraticVotingMessageMessage}
  </div>
</div>

export const ProjectAddToBallot = ({ id, name }: Props) => {
  const { address } = useAccount();
  const [isOpen, setOpen] = useState(false);
  const add = useAddToBallot();
  const remove = useRemoveFromBallot();
  const round = useCurrentRound();
  const { data: ballot } = useBallot();

  const inBallot = ballotContains(id!, ballot);
  const allocations = ballot?.votes ?? [];
  const sum = sumBallot(allocations.filter((p) => p.projectId !== id));
  if (useRoundState() !== "VOTING") return null;

  const maxVotesProject = round.data?.maxVotesProject ?? 0;
  const maxVotesTotal = round.data?.maxVotesTotal ?? 0;
  return (
    <div>
      {ballot?.publishedAt ? (
        <Button disabled>Ballot published</Button>
      ) : inBallot ? (
        <IconButton
          onClick={() => setOpen(true)}
          variant="secondary"
          icon={Check}
        >
          {formatNumber(inBallot.amount)} allocated
        </IconButton>
      ) : (
        <Button
          disabled={!address}
          onClick={() => setOpen(true)}
          variant="secondary"
          className="w-full md:w-auto"
        >
          Add to ballot
        </Button>
      )}
      <Dialog
        size="sm"
        isOpen={isOpen}
        onOpenChange={setOpen}
        title={`Vote for ${name}`}
      >

        <Alert
          title={QuadraticVotingMessageMessage}
          className="mb-4"
          variant="info"
        ></Alert>


        <p className="mt-2 pb-4 leading-relaxed">
          How much votes should this Project receive to fill the gap between the
          impact they generated and the profit they received for generating this
          impact
        </p>
        <Form
          defaultValues={{ amount: inBallot?.amount }}
          schema={z.object({
            amount: z
              .number()
              .min(0)
              .max(Math.min(maxVotesProject, maxVotesTotal - sum))
              .default(0),
          })}
          onSubmit={({ amount }) => {
            add.mutate([{ projectId: id!, amount }]);
            setOpen(false);
          }}
        >
          <ProjectAllocation
            current={sum}
            inBallot={Boolean(inBallot)}
            maxVotesProject={maxVotesProject}
            maxVotesTotal={maxVotesTotal}
            onRemove={() => {
              remove.mutate(id!);
              setOpen(false);
            }}
          />
        </Form>
      </Dialog>
    </div>
  );
};

const ProjectAllocation = ({
  current = 0,
  inBallot,
  maxVotesProject,
  maxVotesTotal,
  onRemove,
}: {
  current: number;
  inBallot: boolean;
  maxVotesProject: number;
  maxVotesTotal: number;
  onRemove: () => void;
}) => {
  const form = useFormContext();
  const formAmount = form.watch("amount") as string;
  const amount = formAmount
    ? parseFloat(String(formAmount).replace(/,/g, ""))
    : 0;
  const total = amount + current;

  const exceededProjectTokens = amount > maxVotesProject;
  const exceededMaxTokens = total > maxVotesTotal;

  const isError = exceededProjectTokens || exceededMaxTokens;
  return (
    <div>
      <AllocationInput error={isError} name="amount" />
      <div className="flex justify-between gap-2 pt-2 text-sm">
        <div className="flex gap-2">
          <span className="text-gray-600">
            Total votes allocated:
          </span>
          <span
            className={clsx("font-semibold", {
              ["text-red-500"]: exceededMaxTokens,
            })}
          >
            {formatNumber(total)}
          </span>
        </div>
        <div className="flex gap-2">
          <span
            className={clsx("font-semibold", {
              ["text-red-500"]: exceededProjectTokens,
            })}
          >
            {formatNumber(amount)}
          </span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-600">
            {formatNumber(maxVotesProject)}
          </span>
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <Button
          variant="primary"
          type="submit"
          className="w-full"
          disabled={isError}
        >
          {inBallot ? "Update" : "Add"} votes
        </Button>
        {inBallot ? (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onRemove}
          >
            Remove from ballot
          </Button>
        ) : null}
      </div>
    </div>
  );
};
