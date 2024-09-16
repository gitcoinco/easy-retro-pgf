import { Button, IconButton } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { Spinner } from "~/components/ui/Spinner";
import { cn } from "~/utils/classNames";
import { useBatchDistribute } from "../hooks/useBatchDistribute";
import { Distribution } from "../types";

export function ConfirmDistributionDialog({
  distribution,
  network,
  onOpenChange,
  togglePayoutsCompleted,
}: {
  distribution: Distribution[];
  network: string;
  onOpenChange: () => void;
  togglePayoutsCompleted: () => void;
}) {
  const {
    isPending,
    isFunding,
    currentDistribution,
    batchTotalAmount,
    isPoolUnderfunded,
    fundThePool,
    confirmDistribution,
    amountToFund,
    remainingProjectsAfterBatch,
  } = useBatchDistribute({
    distribution,
    network,
    onPayoutsCompleted: togglePayoutsCompleted,
    onCloseDialog: onOpenChange,
  });

  const projectsLeft = remainingProjectsAfterBatch > 0;

  return (
    <Modal
      isOpen={distribution.length > 0}
      size="sm"
      title="Confirm distribution"
      onOpenChange={onOpenChange}
    >
      {isPoolUnderfunded || isFunding ? (
        <div>
          <div className="mb-4">
            Not enough funds in the pool to distribute. Please fund the pool
            first.
          </div>
          <div className="mb-4 flex flex-col items-center">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
              <div>Amount Required</div>
            </h3>
            <div
              className={cn("text-2xl", {
                ["text-red-600"]: isPoolUnderfunded,
              })}
            >
              {amountToFund}
            </div>
          </div>
          <div className="space-y-1">
            <IconButton
              disabled={isFunding}
              icon={isFunding ? Spinner : null}
              className={"w-full"}
              variant="primary"
              onClick={async () => {
                await fundThePool();
              }}
            >
              {isFunding ? "Funding in progress..." : "Fund Pool"}
            </IconButton>
            <Button className={"w-full"} onClick={onOpenChange}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="mb-4">
            <strong>
              Distributing to {currentDistribution.length} projects in this
              batch.
            </strong>
            <br />
            <span className={!projectsLeft ? "text-green-600" : ""}>
              {!projectsLeft
                ? "This is the final batch! All projects will be distributed."
                : `${remainingProjectsAfterBatch} projects remain to be distributed after this batch.`}
            </span>
          </div>
          <div className="mb-4 flex flex-col items-center">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
              <div>Amount to distribute</div>
            </h3>
            <div className="text-2xl">{batchTotalAmount}</div>
          </div>
          <div className="space-y-1">
            <IconButton
              disabled={isPending || isPoolUnderfunded}
              icon={isPending ? Spinner : null}
              className={"w-full"}
              variant="primary"
              onClick={async () => {
                await confirmDistribution();
              }}
            >
              {isPending
                ? "Confirming distribution..."
                : "Confirm Distribution"}
            </IconButton>
            <Button className={"w-full"} onClick={onOpenChange}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
