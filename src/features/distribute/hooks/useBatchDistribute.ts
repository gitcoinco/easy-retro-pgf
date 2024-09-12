import { useMemo, useState } from "react";
import { useDistribute } from "~/features/distribute/hooks/useDistribute";
import {
  usePoolAmount,
  usePoolToken,
  useFundPool,
  usePoolId,
} from "../hooks/useAlloPool";
import { Address, parseUnits } from "viem";
import { batchDistributePerNetwork } from "~/config";
import { Distribution } from "~/features/distribute/types";

export function useBatchDistribute({
  distribution,
  network,
  onPayoutsCompleted,
  onCloseDialog,
}: {
  distribution: Distribution[];
  network: string;
  onPayoutsCompleted: () => void;
  onCloseDialog: () => void;
}) {
  const { data: token } = usePoolToken();
  const { data: balance } = usePoolAmount();
  const [isFullyFunded, setIsFullyFunded] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<number>(0);

  const { isPending, mutateAsync } = useDistribute();
  const { data: poolId } = usePoolId();
  const { isPending: isFunding, mutateAsync: fundPool } = useFundPool();

  //   Get the batch limit for the current network
  const batchLimit =
    batchDistributePerNetwork[
      network as keyof typeof batchDistributePerNetwork
    ] || 1;
  // Calculate the total amount needed for all batches
  const totalAmounts = distribution.reduce(
    (sum, x) =>
      sum +
      parseUnits(handleAmount(x.amount, token?.decimals), token?.decimals),
    BigInt(0),
  );

  // Split distributions into batches based on the batch limit
  const batches = useMemo(() => {
    const totalBatches = Math.ceil(distribution.length / batchLimit);
    const result = [];
    for (let i = 0; i < totalBatches; i++) {
      result.push(distribution.slice(i * batchLimit, (i + 1) * batchLimit));
    }
    return result;
  }, [distribution, batchLimit]);

  const currentDistribution = batches[currentBatch] || [];

  const { projectIds, recipients, amounts } = useMemo(() => {
    return currentDistribution.reduce(
      (acc, x) => ({
        projectIds: acc.projectIds.concat(x.projectId as `0x${string}`),
        recipients: acc.recipients.concat(x.payoutAddress as Address),
        amounts: acc.amounts.concat(
          parseUnits(handleAmount(x.amount, token?.decimals), token?.decimals),
        ),
      }),
      { recipients: [], amounts: [], projectIds: [] } as {
        recipients: Address[];
        amounts: bigint[];
        projectIds: `0x${string}`[];
      },
    );
  }, [currentDistribution, token]);

  const balanceBigInt = BigInt(balance ?? 0);
  const batchTotalAmount = amounts.reduce((sum, x) => sum + x, BigInt(0));

  const isPoolUnderfunded = !isFullyFunded && totalAmounts > balanceBigInt;
  const amountDiff = isPoolUnderfunded
    ? totalAmounts - balanceBigInt
    : balanceBigInt - totalAmounts;

  const fundThePool = async () => {
    if (poolId) {
      await fundPool?.(
        { poolId, amount: amountDiff },
        {
          onSuccess: () => {
            setIsFullyFunded(true);
          },
        },
      );
    }
  };

  const confirmDistribution = async () => {
    await mutateAsync?.(
      { projectIds, recipients, amounts },
      {
        onSuccess: handleNextBatch,
      },
    );
  };

  const handleNextBatch = () => {
    if (currentBatch < batches.length - 1) {
      setCurrentBatch(currentBatch + 1);
    } else {
      // All batches processed
      onPayoutsCompleted(); // Refetch or handle after all payouts
      onCloseDialog(); // Close the modal/dialog
    }
  };

  return {
    isPending,
    isFunding,
    currentBatch,
    batches,
    currentDistribution,
    batchTotalAmount,
    balanceBigInt,
    isPoolUnderfunded,
    fundThePool,
    confirmDistribution,
    isFullyFunded,
    amountDiff,
    token,
  };
}

function handleAmount(
  amount: number | undefined,
  decimals: number | undefined,
) {
  if (!amount || !decimals) return "0";
  if (amount < 1 / 10 ** decimals) return "0";
  return amount.toString();
}
