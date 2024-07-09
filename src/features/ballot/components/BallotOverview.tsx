import { type PropsWithChildren, type ReactNode } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

import { Button } from "~/components/ui/Button";
import { Progress } from "~/components/ui/Progress";
import { sumBallot } from "~/features/ballot/hooks/useBallot";
import { formatNumber } from "~/utils/formatNumber";
import { VotingEndsIn } from "./VotingEndsIn";
import { useProjectCount } from "~/features/projects/hooks/useProjects";
import { useIsMutating } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { api } from "~/utils/api";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import dynamic from "next/dynamic";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { Spinner } from "~/components/ui/Spinner";
import { createComponent } from "~/components/ui";
import { tv } from "tailwind-variants";
import { useBallot } from "~/features/ballot/hooks/useBallot";
import { SubmitBallotButton } from "./SubmitBallotButton";

function BallotOverview() {
  const router = useRouter();

  const { data: ballot } = useBallot();
  const isSaving = useIsMutating({ mutationKey: getQueryKey(api.ballot.save) });

  const round = useCurrentRound();
  const allocations = ballot?.allocations ?? [];
  const sum = sumBallot(allocations);

  const canSubmit = router.route.includes("ballot") && allocations.length;

  const { data: projectCount } = useProjectCount();

  const maxVotesTotal = round.data?.maxVotesTotal ?? 0;

  const roundState = useRoundState();

  if (round.isPending || !round.data) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="size-4" />
      </div>
    );
  }
  const domain = round.data?.domain;

  if (roundState === "RESULTS")
    return (
      <BallotMessage>
        <BallotHeader>Results are live!</BallotHeader>
        <BallotSection title="Results are being tallied"></BallotSection>
        <Button as={Link} href={`/${domain}/projects/results`}>
          Go to results
        </Button>
      </BallotMessage>
    );
  if (roundState === "TALLYING")
    return (
      <BallotMessage>
        <BallotHeader>Voting has ended</BallotHeader>
        <BallotSection title="Results are being tallied"></BallotSection>
      </BallotMessage>
    );
  if (roundState !== "VOTING")
    return (
      <BallotMessage>
        <BallotHeader>Voting hasn't started yet</BallotHeader>
        {roundState === "REVIEWING" ? (
          <BallotSection title="Applications are being reviewed" />
        ) : (
          <Button as={Link} href={`/${domain}/applications/new`}>
            Create application
          </Button>
        )}
      </BallotMessage>
    );

  return (
    <div className="mb-2 space-y-6">
      <BallotHeader>Your ballot</BallotHeader>
      <BallotSection title="Voting ends in:">
        <VotingEndsIn resultAt={round.data.resultAt!} />
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
                ["text-red-500"]: sum > maxVotesTotal,
              })}
            >
              {formatNumber(sum)} votes
            </div>
          </div>
        }
      >
        <Progress value={sum} max={maxVotesTotal} />
        <div className="flex justify-between text-xs">
          <div>Total</div>
          <div>{formatNumber(maxVotesTotal ?? 0)} votes</div>
        </div>
      </BallotSection>
      <SubmitBallotButton disabled={sum > maxVotesTotal} />
    </div>
  );
}

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
