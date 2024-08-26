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
import { VotingEndsIn } from "./VotingEndsIn";
import {
  useProjectCount,
  useDownloadProjects,
} from "~/features/projects/hooks/useProjects";
import { config } from "~/config";
import { useIsMutating } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { api } from "~/utils/api";
import { getAppState } from "~/utils/state";
import dynamic from "next/dynamic";
import { createComponent } from "~/components/ui";
import { tv } from "tailwind-variants";
import { useApprovedVoter } from "~/features/voters/hooks/useApprovedVoter";
import { useAccount } from "wagmi";

function BallotOverview() {
  const router = useRouter();

  const { data: ballot } = useBallot();
  const isSaving = useIsMutating(getQueryKey(api.ballot.save));

  const sum = sumBallot(ballot?.votes);

  const allocations = ballot?.votes ?? [];
  const canSubmit = router.route === "/ballot" && allocations.length;
  const isProjectsPage = router.route === "/projects";

  const DownloadProjectsButton = () => {
    const download = useDownloadProjects();

    return (
      <BallotMessage>
        <BallotHeader>Download Projects CSV</BallotHeader>
        <Button
          size="sm"
          variant="secondary"
          onClick={download.downloadMetadata}
          isLoading={download.isLoading || download.fetched}
          disabled={download.isLoading}
        >
          Download
        </Button>
      </BallotMessage>
    );
  };

  const { data: projectCount } = useProjectCount();

  const appState = getAppState();
  if (appState === "RESULTS")
    return (
      <>
        {isProjectsPage && <DownloadProjectsButton />}

        <BallotMessage>
          <BallotHeader>Results are live!</BallotHeader>
          <BallotSection title="Results are being tallied"></BallotSection>
          <Button as={Link} href={"/projects/results"}>
            Go to results
          </Button>
        </BallotMessage>
      </>
    );
  if (appState === "TALLYING")
    return (
      <>
        {isProjectsPage && <DownloadProjectsButton />}
        <BallotMessage>
          <BallotHeader>Voting has ended</BallotHeader>
          <BallotSection title="Results are being tallied"></BallotSection>
        </BallotMessage>
      </>
    );
  if (appState !== "VOTING")
    return (
      <>
        {isProjectsPage && <DownloadProjectsButton />}
        <BallotMessage>
          <BallotHeader>Voting hasn't started yet</BallotHeader>
          {appState === "REVIEWING" ? (
            <BallotSection title="Applications are being reviewed" />
          ) : (
            <Button as={Link} href={"/applications/new"}>
              Create application
            </Button>
          )}
        </BallotMessage>
      </>
    );

  return (
    <>
      <div className="mb-2 space-y-6">
        {isProjectsPage && <DownloadProjectsButton />}
      </div>
      <div className="mb-2 space-y-6">
        <BallotHeader>Your ballot</BallotHeader>
        <BallotSection title="Voting ends in:">
          <VotingEndsIn />
        </BallotSection>
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
              Votes allocated:
              <div
                className={clsx("text-gray-900 dark:text-gray-300", {
                  ["text-red-500"]: sum > config.votingMaxTotal,
                })}
              >
                {formatNumber(sum)} votes
              </div>
            </div>
          }
        >
          <Progress value={sum} max={config.votingMaxTotal} />
          <div className="flex justify-between text-xs">
            <div>Total</div>
            <div>{formatNumber(config.votingMaxTotal ?? 0)} votes</div>
          </div>
        </BallotSection>
        {ballot?.publishedAt ? (
          <Button className="w-full" as={Link} href={`/ballot/confirmation`}>
            View submitted ballot
          </Button>
        ) : isSaving ? (
          <Button disabled className="w-full" variant="primary">
            Adding to ballot...
          </Button>
        ) : canSubmit ? (
          <SubmitBallotButton disabled={sum > config.votingMaxTotal} />
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
      </div>
    </>
  );
}

const SubmitBallotButton = ({ disabled = false }) => {
  const isSaving = useIsMutating({ mutationKey: getQueryKey(api.ballot.save) });
  const router = useRouter();
  const { address } = useAccount();
  const { data: isApprovedVoter } = useApprovedVoter(address!);
  const [isOpen, setOpen] = useState(false);

  const submit = useSubmitBallot({
    onSuccess: async () => void router.push("/ballot/confirmation"),
  });

  if (!isApprovedVoter) {
    return (
      <Button disabled className="w-full">
        Only approved voters can vote
      </Button>
    );
  }

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
      submit.isPending ? "signing" : submit.error ? "error" : "submitting"
    ];

  return (
    <>
      <Button
        className="w-full"
        variant="primary"
        disabled={disabled || isSaving}
        onClick={async () => setOpen(true)}
      >
        {isSaving ? "Ballot is updating..." : "Submit ballot"}
      </Button>
      <Dialog size="sm" isOpen={isOpen} onOpenChange={setOpen} title={title}>
        <p className="pb-8">{instructions}</p>
        <div
          className={clsx("flex gap-2", {
            ["hidden"]: submit.isPending,
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

const BallotMessage = createComponent(
  "div",
  tv({ base: "flex flex-col items-center gap-2 pt-8" }),
);

const BallotHeader = createComponent(
  "h3",
  tv({
    base: "text-sm font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300",
  }),
);

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
