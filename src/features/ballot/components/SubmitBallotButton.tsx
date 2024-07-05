import { useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Alert } from "~/components/ui/Alert";
import { Button } from "~/components/ui/Button";
import { useSubmitBallot } from "~/features/ballot/hooks/useBallot";
import { Dialog } from "~/components/ui/Dialog";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { useApprovedVoter } from "~/features/voters/hooks/useApprovedVoter";
import { useAccount } from "wagmi";
import {
  useBallot,
  useIsSavingBallot,
} from "~/features/ballot/hooks/useBallot";
import Link from "next/link";

export const SubmitBallotButton = ({ disabled = false }) => {
  const router = useRouter();
  const { address } = useAccount();
  const { data: ballot } = useBallot();
  const isSaving = useIsSavingBallot();

  const { data: isApprovedVoter } = useApprovedVoter(address!);
  const [isOpen, setOpen] = useState(false);
  const domain = useCurrentDomain();
  const submit = useSubmitBallot({
    onSuccess: async () => void router.push(`/${domain}/ballot/confirmation`),
  });

  const onBallotPage =
    router.route.includes("ballot") && ballot?.allocations.length;

  if (ballot?.publishedAt) {
    return (
      <Button
        className="w-full"
        as={Link}
        href={`/${domain}/ballot/confirmation`}
      >
        View submitted ballot
      </Button>
    );
  }

  if (!isApprovedVoter) {
    return (
      <Button disabled className="w-full">
        Only approved voters can vote
      </Button>
    );
  }

  if (!onBallotPage) {
    return (
      <Button
        className="w-full"
        variant="primary"
        as={Link}
        href={`/${domain}/ballot`}
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
        Submit ballot
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
