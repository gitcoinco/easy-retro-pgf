import { useMemo } from "react";
import { Button, IconButton } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import { Spinner } from "~/components/ui/Spinner";
import { useDistribute } from "~/features/distribute/hooks/useDistribute";
import { type Distribution } from "~/features/distribute/types";
import { usePoolAmount, usePoolToken } from "../hooks/useAlloPool";
import { type Address, formatUnits, parseUnits } from "viem";
import { cn } from "~/utils/classNames";
import { formatNumber } from "~/utils/formatNumber";

export function ConfirmDistributionDialog({
  distribution,
  onOpenChange,
}: {
  distribution: Distribution[];
  onOpenChange: () => void;
}) {
  const { data: token } = usePoolToken();
  const { data: balance } = usePoolAmount();

  const { isPending, mutate } = useDistribute();

  const { recipients, amounts } = useMemo(() => {
    return distribution.reduce(
      (acc, x) => ({
        recipients: acc.recipients.concat(x.payoutAddress as Address),
        amounts: acc.amounts.concat(
          parseUnits(String(x.amount), token.decimals),
        ),
      }),
      { recipients: [], amounts: [] } as {
        recipients: Address[];
        amounts: bigint[];
      },
    );
  }, [distribution]);

  const amountDiff = (balance ?? 0n) - amounts.reduce((sum, x) => sum + x, 0n);

  return (
    <Dialog
      isOpen={distribution.length > 0}
      size="sm"
      title="Confirm distribution"
      onOpenChange={onOpenChange}
    >
      <div className="mb-4">
        This will distribute the pools funds to the payout addresses according
        to the table.
      </div>

      <div className="mb-4 flex flex-col items-center">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
          <div>Pool balance after distribution</div>
        </h3>
        <div
          className={cn("text-2xl", {
            ["text-red-600"]: amountDiff < 0n,
          })}
        >
          {formatNumber(Number(formatUnits(amountDiff, token.decimals)))}
        </div>
      </div>
      <div className="space-y-1">
        <IconButton
          disabled={isPending || amountDiff < 0}
          icon={isPending ? Spinner : null}
          className={"w-full"}
          variant="primary"
          onClick={() =>
            mutate?.(
              { recipients, amounts },
              { onSuccess: () => onOpenChange() },
            )
          }
        >
          {isPending ? "Confirming..." : "Confirm"}
        </IconButton>
        <Button className={"w-full"} onClick={onOpenChange}>
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}
