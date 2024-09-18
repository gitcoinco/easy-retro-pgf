import { useMemo, useState } from "react";
import { useDistribute } from "~/features/distribute/hooks/useDistribute";
import {
  usePoolAmount,
  usePoolToken,
  useFundPool,
  usePoolId,
} from "../hooks/useAlloPool";
import { Address, formatUnits, parseUnits } from "viem";
import { batchDistributePerNetwork } from "~/config";
import { Distribution } from "~/features/distribute/types";
import { useQueryClient } from "@tanstack/react-query";

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
  const { data: poolId } = usePoolId();
  const { isPending: isFunding, mutateAsync: fundPool } = useFundPool();
  const queryClient = useQueryClient();

  //   Get the batch limit for the current network
  const batchLimit =
    batchDistributePerNetwork[
      network as keyof typeof batchDistributePerNetwork
    ] || 1;

  // Split distributions into batches based on the batch limit
  const batches = useMemo(() => {
    const totalBatches = Math.ceil(distribution.length / batchLimit);
    const result = [];
    for (let i = 0; i < totalBatches; i++) {
      result.push(distribution.slice(i * batchLimit, (i + 1) * batchLimit));
    }
    setCurrentBatch(0);
    return result;
  }, [distribution, batchLimit]);

  const currentDistribution = batches[currentBatch] || [];

  const remainingProjectsAfterBatch = batches
    .filter((_, i) => i > currentBatch)
    .reduce((sum, x) => sum + x.length, 0);

  const { isPending, mutateAsync } = useDistribute(
    `${currentDistribution.length} distributions processed in this batch`,
  );

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

  const { batchTotalAmount, isPoolUnderfunded, amountDiff } = useMemo(() => {
    // Calculate the total amount of tokens to be distributed excluding the already processed batches
    const totalAmounts =
      distribution.reduce(
        (sum, x) =>
          sum +
          parseUnits(handleAmount(x.amount, token?.decimals), token?.decimals),
        BigInt(0),
      ) -
      batches
        .slice(0, currentBatch)
        .flat()
        .reduce(
          (sum, x) =>
            sum +
            parseUnits(
              handleAmount(x.amount, token?.decimals),
              token?.decimals,
            ),
          BigInt(0),
        );

    const balanceBigInt = BigInt(balance ?? 0);
    const batchTotalAmount = formatUnits(
      amounts.reduce((sum, x) => sum + x, BigInt(0)),
      token?.decimals || 18,
    );
    const isPoolUnderfunded = !isFullyFunded && totalAmounts > balanceBigInt;
    const amountDiff = isPoolUnderfunded
      ? totalAmounts - balanceBigInt
      : balanceBigInt - totalAmounts;

    return { batchTotalAmount, isPoolUnderfunded, amountDiff };
  }, [
    distribution,
    batches,
    currentBatch,
    balance,
    amounts,
    isFullyFunded,
    token,
  ]);

  const amountToFund = formatUnits(amountDiff, token?.decimals || 18);

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
      queryClient.invalidateQueries({ queryKey: ["distribute-info", poolId] });
    } else {
      // All batches processed
      onPayoutsCompleted();
      queryClient.invalidateQueries({ queryKey: ["distribute-info", poolId] });
      onCloseDialog(); // Close the modal/dialog
    }
  };

  return {
    isPending,
    isFunding,
    currentDistribution,
    batchTotalAmount,
    isPoolUnderfunded,
    fundThePool,
    confirmDistribution,
    amountToFund,
    remainingProjectsAfterBatch,
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
