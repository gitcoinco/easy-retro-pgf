import Link from "next/link";
import {
  type ComponentPropsWithoutRef,
  type FunctionComponent,
  createElement,
  useState,
} from "react";
import { useAccount } from "wagmi";
import {
  AlertCircle,
  CheckCircle2,
  History,
  ListPlus,
  type LucideIcon,
} from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button, IconButton } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import { Form } from "~/components/ui/Form";
import { Alert } from "~/components/ui/Alert";
import { formatNumber } from "~/utils/formatNumber";
import {
  ballotContains,
  sumBallot,
  useBallot,
} from "~/features/ballot/hooks/useBallot";
import { useAddToBallot } from "~/features/ballot/hooks/useBallot";
import { Spinner } from "~/components/ui/Spinner";

import { AllocationForm } from "~/features/ballot/components/AllocationList";
import { BallotSchema, type Vote } from "~/features/ballot/types";
import { config } from "~/config";
import { getAppState } from "~/utils/state";
import { useMaciSignup } from "~/hooks/useMaciSignup";

export const ListEditDistribution = ({
  listName,
  votes,
}: {
  listName?: string;
  votes?: Vote[];
}) => {
  const { address } = useAccount();
  const [isOpen, setOpen] = useState(false);
  const { data: ballot } = useBallot();
  const add = useAddToBallot();
  const { isRegistered } = useMaciSignup();

  // What list projects are already in the ballot?
  function itemsInBallot(votes?: Vote[]) {
    return votes?.filter((p) => ballotContains(p.projectId, ballot));
  }

  // Keep the already in ballot in state because we want to update these when user removes allocations
  const [alreadyInBallot, updateInBallot] = useState(itemsInBallot(votes));

  console.log({ alreadyInBallot });
  function handleAddToBallot(values: { votes: Vote[] }) {
    add.mutate(values.votes);
  }

  function handleOpenChange() {
    setOpen(false);
    // updateInBallot(itemsInBallot(listProjects));
    // add.reset(); // This is needed to reset add.isSuccess and show the allocations again
  }

  const ballotVotes = votes?.map((vote) => {
    const ballotVote = ballot?.votes.find(
      (v) => v.projectId === vote.projectId,
    );
    return ballotVote ?? vote;
  });
  const showDialogTitle = !(add.isPending || add.isSuccess);
  const appState = getAppState();
  return (
    <div>
      {appState === "VOTING" && (
        <Button
          variant="primary"
          onClick={() => {
            setOpen(true);
          }}
          className="w-full md:w-auto"
          disabled={!address || add.isSuccess}
        >
          {add.isSuccess ? "List added" : "Add list to ballot"}
        </Button>
      )}
      <Dialog
        title={showDialogTitle ? `Edit distribution` : null}
        size={add.isSuccess ? "sm" : "md"}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
      >
        {add.isSuccess ? (
          <FeedbackDialog variant="success" icon={CheckCircle2}>
            <div className="font-semibold">
              List added to ballot successfully!
            </div>
            <div className="space-y-2">
              {isRegistered && (
                <Button
                  variant="primary"
                  className="w-full"
                  as={Link}
                  href={"/ballot"}
                >
                  View ballot
                </Button>
              )}

              <Button
                className="w-full"
                variant="ghost"
                onClick={handleOpenChange}
              >
                Continue adding projects
              </Button>
            </div>
          </FeedbackDialog>
        ) : add.isPending ? (
          <FeedbackDialog variant="info" icon={Spinner}>
            <div className="font-semibold">Adding list to ballot</div>
          </FeedbackDialog>
        ) : (
          <Form
            schema={BallotSchema}
            defaultValues={{ votes: ballotVotes }}
            onSubmit={handleAddToBallot}
          >
            {alreadyInBallot?.length ? (
              <Alert
                icon={AlertCircle}
                variant="warning"
                title={`${alreadyInBallot?.length} project(s) in the ${listName} list already exist in your ballot.`}
              >
                <div className="flex gap-2">
                  You can change your {config.tokenName} alloaction based on the
                  list or remove the project(s) from the list to keep your
                  existing allocation.
                </div>
              </Alert>
            ) : null}
            <ResetDistribution
              onReset={() => updateInBallot(itemsInBallot(votes))}
            />
            <div className="max-h-[480px] overflow-y-scroll">
              <AllocationForm list={alreadyInBallot} />
            </div>
            <TotalAllocationBanner />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className={"w-full"}
                onClick={handleOpenChange}
              >
                Cancel
              </Button>
              <IconButton
                type="submit"
                variant="primary"
                className={"w-full"}
                icon={ListPlus}
              >
                Add to ballot
              </IconButton>
            </div>
          </Form>
        )}
      </Dialog>
    </div>
  );
};
const TotalAllocationBanner = () => {
  const form = useFormContext<{ votes: Vote[] }>();

  // Load existing ballot
  const { data: ballot } = useBallot();
  const { initialVoiceCredits } = useMaciSignup()

  const sum = sumBallot(ballot?.votes);
  const votes = form.watch("votes") ?? [];

  const current = sumBallot(votes);

  const exceeds = current + sum - initialVoiceCredits;
  const isExceeding = exceeds > 0;

  return (
    <div className="py-4">
      <div className={"flex justify-between font-semibold"}>
        <div>
          {isExceeding
            ? `Total exceeds by ${formatNumber(exceeds)} ${config.tokenName}`
            : "Total"}
        </div>
        <div>
          {formatNumber(current)} {config.tokenName}
        </div>
      </div>
    </div>
  );
};

const ResetDistribution = ({ onReset }: { onReset: () => void }) => {
  const form = useFormContext();

  return (
    <IconButton
      className={form.formState.isDirty ? "" : "text-gray-400"}
      icon={History}
      variant="ghost"
      type="button"
      onClick={() => {
        form.reset();
        onReset();
      }}
    >
      Reset distribution
    </IconButton>
  );
};

export const FeedbackDialog = ({
  icon,
  variant,
  children,
}: ComponentPropsWithoutRef<"div"> & {
  variant: "success" | "info";
  icon: LucideIcon | FunctionComponent<{ className: string }>;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Alert variant={variant}>
        {createElement(icon as unknown as string, { className: "w-8 h-8" })}
      </Alert>
      {children}
    </div>
  );
};