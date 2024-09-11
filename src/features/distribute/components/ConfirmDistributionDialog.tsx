import { useMemo, useState } from "react";
import { Button, IconButton } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import { Spinner } from "~/components/ui/Spinner";
import { useDistribute } from "~/features/distribute/hooks/useDistribute";
import { type Distribution } from "~/features/distribute/types";
import {
  usePoolAmount,
  usePoolToken,
  useFundPool,
  usePoolId,
} from "../hooks/useAlloPool";
import { type Address, formatUnits, parseUnits } from "viem";
import { cn } from "~/utils/classNames";
export function ConfirmDistributionDialog({
  distribution,
  onOpenChange,
}: {
  distribution: Distribution[];
  onOpenChange: () => void;
}) {
  const { data: token } = usePoolToken();
  const { data: balance } = usePoolAmount();
  const [poolFunded, setPoolFunded] = useState(false);

  const { isPending, mutate } = useDistribute();
  const { data: poolId } = usePoolId();
  const { isPending: isFunding, mutate: fundPool } = useFundPool();

  const { recipients, amounts } = useMemo(() => {
    return distribution.reduce(
      (acc, x) => ({
        recipients: acc.recipients.concat(x.payoutAddress as Address),
        amounts: acc.amounts.concat(
          parseUnits(handleAmount(x.amount, token.decimals), token.decimals),
        ),
      }),
      { recipients: [], amounts: [] } as {
        recipients: Address[];
        amounts: bigint[];
      },
    );
  }, [distribution]);

  const balanceBigInt = BigInt(balance ?? 0);
  const totalAmounts = amounts.reduce((sum, x) => sum + x, BigInt(0));
  const isPoolUnderfunded = totalAmounts > balanceBigInt;
  const amountDiff = isPoolUnderfunded
    ? totalAmounts - balanceBigInt
    : balanceBigInt - totalAmounts;

  const renderFundingMessage = () => (
    <div>
      <div className="mb-4">
        Not enough funds in the pool to distribute. Please fund the pool first.
      </div>
      <div className="mb-4 flex flex-col items-center">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
          <div>Amount Required</div>
        </h3>
        <div
          className={cn("text-2xl", { ["text-red-600"]: isPoolUnderfunded })}
        >
          {formatUnits(amountDiff, token.decimals)}
        </div>
      </div>
      <div className="space-y-1">
        <IconButton
          disabled={isFunding || !poolId}
          icon={isFunding ? Spinner : null}
          className={"w-full"}
          variant="primary"
          onClick={() => {
            if (poolId) {
              fundPool?.(
                { poolId, amount: amountDiff },
                { onSuccess: () => setPoolFunded(true) },
              );
            }
          }}
        >
          {isPending ? "Funding in progress..." : "Fund Pool"}
        </IconButton>
        <Button className={"w-full"} onClick={onOpenChange}>
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderDistributionMessage = () => (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">
        This will distribute the pool's funds to the specified payout addresses
        according to the table.
      </div>
      <div className="mb-4 flex flex-col items-center">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
          <div>Projected Pool Balance After Distribution</div>
        </h3>
        <div
          className={cn("text-2xl", { ["text-red-600"]: isPoolUnderfunded })}
        >
          {formatUnits(amountDiff, token.decimals)}
        </div>
      </div>
      <div className="space-y-1">
        <IconButton
          disabled={isPending || isPoolUnderfunded}
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
          {isPending ? "Confirming distribution..." : "Confirm Distribution"}
        </IconButton>
        <Button className={"w-full"} onClick={onOpenChange}>
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog
      isOpen={distribution.length > 0}
      size="sm"
      title="Confirm distribution"
      onOpenChange={onOpenChange}
    >
      {(isPoolUnderfunded || isFunding) && !poolFunded
        ? renderFundingMessage()
        : renderDistributionMessage()}
    </Dialog>
  );
}

/**
 *
 * Checks if the amount is less than 1/10^decimals to avoid errors.
 * @param amount
 * @param decimals
 * @returns "0" if the amount is less than 1/10^decimals
 *  or If the amount is undefined.
 * Otherwise, it returns the amount as a string.
 */
function handleAmount(amount: number | undefined, decimals: number) {
  if (!amount) return "0";
  if (amount < 1 / 10 ** decimals) {
    return "0";
  } else {
    return amount.toString();
  }
}
