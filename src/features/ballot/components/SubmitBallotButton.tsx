import { useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Alert } from "~/components/ui/Alert";
import { Button } from "~/components/ui/Button";
import { useSubmitBallot } from "~/features/ballot/hooks/useBallot";
import { Dialog } from "~/components/ui/Dialog";
import {
  useCurrentDomain,
  useCurrentRound,
} from "~/features/rounds/hooks/useRound";
import { useApprovedVoter } from "~/features/voters/hooks/useApprovedVoter";
import {
  useBallot,
  useIsSavingBallot,
} from "~/features/ballot/hooks/useBallot";
import Link from "next/link";
import { useSessionAddress } from "~/hooks/useSessionAddress";

export const SubmitBallotButton = ({ disabled = false }) => {
  const router = useRouter();
  const { address } = useSessionAddress();
  const { data: ballot, refetch } = useBallot();
  const isSaving = useIsSavingBallot();

  const { data: isApprovedVoter, isPending } = useApprovedVoter(address);
  const [isOpen, setOpen] = useState(false);
  const domain = useCurrentDomain();
  const round = useCurrentRound();
  const submit = useSubmitBallot();

  const onBallotPage =
    router.route.includes("ballot") && ballot?.allocations.length;

  if (!isApprovedVoter && !isPending) {
    return (
      <Button disabled className="w-full">
        Only approved voters can vote
      </Button>
    );
  }

  if (!onBallotPage) {
    const isImpactRound = round.data?.type === "impact";
    return (
      <Button
        className="w-full"
        variant="primary"
        as={Link}
        href={`/${domain}/ballot${isImpactRound && "/metrics"}`}
      >
        View ballot
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
        "Once you submit your ballot, you can change it until the voting period ends. If you are ready, go ahead and submit!",
    },
    success: {
      title: "Your vote has been submitted! 🥳",
      instructions:
        "Thank you for participating in the round. You can view your ballot and make changes until the voting period ends.",
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

  function handleOpen(bool: boolean) {
    submit.reset();
    setOpen(bool);
  }

  const { title, instructions } =
    messages[
      submit.isSuccess
        ? "success"
        : submit.isPending
          ? "signing"
          : submit.error
            ? "error"
            : "submitting"
    ];

  return (
    <>
      <Button
        className="w-full"
        variant="primary"
        isLoading={submit.isPending || isSaving}
        disabled={disabled || isSaving}
        onClick={async () => setOpen(true)}
      >
        Submit ballot
      </Button>
      <Dialog size="sm" isOpen={isOpen} onOpenChange={handleOpen} title={title}>
        <p className="pb-8">{instructions}</p>
        <div
          className={clsx("flex gap-2", {
            ["hidden"]: submit.isPending,
          })}
        >
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => handleOpen(false)}
          >
            Back
          </Button>
          {!submit.isSuccess && (
            <Button
              className="flex-1"
              variant="primary"
              onClick={() =>
                submit.mutate(undefined, {
                  onSuccess: () => {
                    void refetch();
                  },
                })
              }
            >
              Submit ballot
            </Button>
          )}
        </div>
      </Dialog>
    </>
  );
};
