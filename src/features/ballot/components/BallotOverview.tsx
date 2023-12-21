import { type PropsWithChildren, type ReactNode, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

import { Alert } from "~/components/ui/Alert";
import { Button } from "~/components/ui/Button";
import { Progress } from "~/components/ui/Progress";
import {
  useSubmitBallot,
  useBallot,
  sumBallot,
} from "~/features/ballot/hooks/useBallot";
import { formatNumber } from "~/utils/formatNumber";
import { Dialog } from "~/components/ui/Dialog";
import { VotingEndsIn, useVotingTimeLeft } from "./VotingEndsIn";
import { useProjectCount } from "~/features/projects/hooks/useProjects";

export const MAX_ALLOCATION_TOTAL = Number(
  process.env.NEXT_PUBLIC_MAX_ALLOCATION_TOTAL!,
);
export const BallotOverview = () => {
  const router = useRouter();

  const { data: ballot } = useBallot();

  const sum = sumBallot(ballot?.votes);

  const allocations = ballot?.votes ?? [];
  const [, , , seconds] = useVotingTimeLeft();
  const canSubmit = router.route === "/ballot" && allocations.length;
  const votingHasEnded = seconds < 0;

  const { data: projectCount } = useProjectCount();
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300">
        Your ballot
      </h3>
      <BallotSection title="Voting ends in:">
        <VotingEndsIn />
      </BallotSection>
      {!votingHasEnded ? (
        <>
          <BallotSection title="Projects added:">
            <div>
              <span className="text-gray-900 dark:text-gray-300">
                {allocations.length}
              </span>
              /{projectCount?.count}
            </div>
          </BallotSection>
          <BallotSection
            title={
              <div className="flex justify-between">
                OP allocated:
                <div
                  className={clsx("text-gray-900 dark:text-gray-300", {
                    ["text-primary-500"]: sum > MAX_ALLOCATION_TOTAL,
                  })}
                >
                  {formatNumber(sum)} OP
                </div>
              </div>
            }
          >
            <Progress value={sum} max={MAX_ALLOCATION_TOTAL} />
            <div className="flex justify-between text-xs">
              <div>Total</div>
              <div>{formatNumber(MAX_ALLOCATION_TOTAL)} OP</div>
            </div>
          </BallotSection>
          {ballot?.publishedAt ? (
            <Button className="w-full" as={Link} href={`/ballot/confirmation`}>
              View submitted ballot
            </Button>
          ) : canSubmit ? (
            <SubmitBallotButton disabled={sum > MAX_ALLOCATION_TOTAL} />
          ) : allocations.length ? (
            <Button
              className="w-full"
              variant="primary"
              as={Link}
              href={"/ballot"}
            >
              View ballot
            </Button>
          ) : (
            <Button className={"w-full"} variant="primary" disabled>
              No projects added yet
            </Button>
          )}
        </>
      ) : null}
    </div>
  );
};

const SubmitBallotButton = ({ disabled = false }) => {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  const submit = useSubmitBallot({
    onSuccess: async () => void router.push("/ballot/confirmation"),
  });

  const messages = {
    signing: {
      title: "Sign ballot",
      instructions:
        "Confirm the transactions in your wallet to submit your  ballot.",
    },
    submitting: {
      title: "Submit ballot",
      instructions:
        "Once you submit your ballot, you won’t be able to change it. If you are ready, go ahead and submit!",
    },
    error: {
      title: "Error subitting ballot",
      instructions: (
        <Alert
          variant="warning"
          title={(submit.error as { message?: string })?.message}
        >
          There was an error submitting the ballot.
        </Alert>
      ),
    },
  };

  const { title, instructions } =
    messages[
      submit.isLoading ? "signing" : submit.error ? "error" : "submitting"
    ];

  return (
    <>
      <Button
        className="w-full"
        variant="primary"
        disabled={disabled}
        onClick={async () => setOpen(true)}
      >
        Submit ballot
      </Button>
      <Dialog size="sm" isOpen={isOpen} onOpenChange={setOpen} title={title}>
        <p className="pb-8">{instructions}</p>
        <div
          className={clsx("flex gap-2", {
            ["hidden"]: submit.isLoading,
          })}
        >
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Back
          </Button>
          <Button
            className="flex-1"
            variant="primary"
            onClick={() => submit.mutate()}
          >
            Submit ballot
          </Button>
        </div>
      </Dialog>
    </>
  );
};

const BallotSection = ({
  title,
  children,
}: { title: string | ReactNode } & PropsWithChildren) => (
  <div className="space-y-1 text-gray-500">
    <h4 className="text-sm font-semibold ">{title}</h4>
    <div className="space-y-1 text-lg font-semibold">{children}</div>
  </div>
);
