import { type PropsWithChildren, type ReactNode, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

import { Alert } from "~/components/ui/Alert";
import { Button } from "~/components/ui/Button";
import { Progress } from "~/components/ui/Progress";
import {
  useBallot,
  sumBallot,
  useLockBallot,
} from "~/features/ballot/hooks/useBallot";
import { formatNumber } from "~/utils/formatNumber";
import { Dialog } from "~/components/ui/Dialog";
import { VotingEndsIn } from "./VotingEndsIn";
import {
  useProjectCount,
  useProjectIdMapping,
} from "~/features/projects/hooks/useProjects";
import { config } from "~/config";
import { getAppState } from "~/utils/state";
import dynamic from "next/dynamic";
import { useMaciSignup } from "~/hooks/useMaciSignup";
import { useMaciVote } from "~/hooks/useMaciVote";

function BallotOverview() {
  const router = useRouter();

  const { isRegistered, isEligibleToVote } = useMaciSignup();
  const { data: ballot } = useBallot();
  const { initialVoiceCredits } = useMaciSignup();

  const sum = sumBallot(ballot?.votes);

  const allocations = ballot?.votes ?? [];
  const canSubmit = router.route === "/ballot" && allocations.length;

  const { data: projectCount } = useProjectCount();

  const appState = getAppState();

  if (appState === "RESULTS")
    return (
      <div className="flex flex-col items-center gap-2 pt-8 ">
        <BallotHeader>Results are live!</BallotHeader>
        <Button as={Link} href={"/projects/results"}>
          Go to results
        </Button>
      </div>
    );

  if (appState === "TALLYING")
    return (
      <div className="flex flex-col items-center gap-2 pt-8 ">
        <BallotHeader>Voting has ended</BallotHeader>
        <BallotSection title="Results are being tallied"></BallotSection>
      </div>
    );

  if (appState !== "VOTING")
    return (
      <div className="flex flex-col items-center gap-2 pt-8 ">
        <BallotHeader>Voting hasn't started yet</BallotHeader>
        {appState === "REVIEWING" ? (
          <BallotSection title="Applications are being reviewed" />
        ) : (
          <Button as={Link} href={"/applications/new"}>
            Create application
          </Button>
        )}
      </div>
    );

  return (
    <div className="space-y-6">
      <BallotHeader>Your ballot</BallotHeader>
      <BallotSection title="Voting ends in:">
        <VotingEndsIn />
      </BallotSection>
      {isRegistered && (
        <BallotSection title="Projects added:">
          <div>
            <span className="text-gray-900 dark:text-gray-300">
              {allocations.length}
            </span>
            /{projectCount?.count}
          </div>
        </BallotSection>
      )}
      {isRegistered && (
        <BallotSection
          title={
            <div className="flex justify-between">
              {config.tokenName} allocated:
              <div
                className={clsx("text-gray-900 dark:text-gray-300", {
                  ["text-primary-500"]: sum > initialVoiceCredits,
                })}
              >
                {formatNumber(sum)} {config.tokenName}
              </div>
            </div>
          }
        >
          <Progress value={sum} max={initialVoiceCredits} />
          <div className="flex justify-between text-xs">
            <div>Total</div>
            <div>
              {formatNumber(initialVoiceCredits)} {config.tokenName}
            </div>
          </div>
        </BallotSection>
      )}
      {!isRegistered || !isEligibleToVote ? null : ballot?.publishedAt ? (
        <Button className="w-full" as={Link} href={`/ballot/confirmation`}>
          View submitted ballot
        </Button>
      ) : canSubmit ? (
        <SubmitBallotButton disabled={sum > initialVoiceCredits} />
      ) : (
        <Button className={"w-full"} variant="primary" disabled>
          No projects added yet
        </Button>
      )}
    </div>
  );
}

const SubmitBallotButton = ({ disabled = false }) => {
  const [isOpen, setOpen] = useState(false);
  const { isLoading, pollId, error, onVote } = useMaciVote();
  const { data: ballot } = useBallot();
  const { lock, unlock } = useLockBallot();

  const projectIndices = useProjectIdMapping(ballot);

  const router = useRouter();

  const submit = {
    isLoading,
    error,
    mutate: async () => {
      const votes =
        ballot?.votes.map(({ amount, projectId }) => ({
          voteOptionIndex: BigInt(projectIndices[projectId]!),
          newVoteWeight: BigInt(amount),
        })) ?? [];

      await onVote(
        votes,
        async () => {
          await unlock.mutateAsync({ pollId: pollId! });
        },
        async () => {
          await lock.mutateAsync({ pollId: pollId! });
          await router.push("/ballot/confirmation");
        },
      );
    },
  };

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
      title: "Error submitting ballot",
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

function BallotHeader(props: PropsWithChildren) {
  return (
    <h3
      className="text-sm font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300"
      {...props}
    />
  );
}

function BallotSection({
  title,
  children,
}: { title: string | ReactNode } & PropsWithChildren) {
  return (
    <div className="space-y-1 text-gray-500">
      <h4 className="text-sm font-semibold ">{title}</h4>
      <div className="space-y-1 text-lg font-semibold">{children}</div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(BallotOverview), { ssr: false });
