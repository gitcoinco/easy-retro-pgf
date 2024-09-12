import { Button, IconButton } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import { Spinner } from "~/components/ui/Spinner";
import { cn } from "~/utils/classNames";
import { formatUnits } from "viem"; // Use from viem for formatting
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
    currentBatch,
    batches,
    currentDistribution,
    batchTotalAmount,
    isPoolUnderfunded,
    fundThePool,
    confirmDistribution,
    isFullyFunded,
    amountDiff,
    token,
  } = useBatchDistribute({
    distribution,
    network,
    onPayoutsCompleted: togglePayoutsCompleted,
    onCloseDialog: onOpenChange,
  });

  return (
    <Dialog
      isOpen={distribution.length > 0}
      size="sm"
      title="Confirm distribution"
      onOpenChange={onOpenChange}
    >
      {(isPoolUnderfunded && !isFullyFunded) || isFunding ? (
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
              {formatUnits(amountDiff, token?.decimals || 18)}
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
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            Distributing batch {currentBatch + 1} of {batches.length}.
            <br />
            Distributing {currentDistribution.length} projects in this batch.
          </div>
          <div className="mb-4 flex flex-col items-center">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
              <div>Amount to distribute in batch {currentBatch + 1}</div>
            </h3>
            <div
              className={cn("text-2xl", {
                ["text-red-600"]: isPoolUnderfunded,
              })}
            >
              {formatUnits(batchTotalAmount, token?.decimals || 18)}
            </div>
          </div>
          <div className="space-y-1">
            <IconButton
              disabled={isPending || (isPoolUnderfunded && !isFullyFunded)}
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
    </Dialog>
  );
}
