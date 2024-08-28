import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "~/utils/api";
import {
  usePoolAmount,
  usePoolId,
  usePool,
  usePoolToken,
} from "../hooks/useAlloPool";
import { usePublicClient } from "wagmi";
import { abi } from "~/lib/rpgf/abi";
import { type Payout } from "~/features/distribute/types";
import { explorerLinks } from "~/config";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

export function useDistributeInfo() {
  const [payoutsByTransaction, setPayoutsByTransaction] = useState<
    Record<string, Payout[]>
  >({});
  const [fetched, setFetched] = useState(false);
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);
  const round = useCurrentRound();
  const publicClient = usePublicClient();
  const { data: poolId } = usePoolId();
  const poolAmount = usePoolAmount();
  const token = usePoolToken();
  const { data: pool } = usePool(poolId!);

  const totalTokens = poolAmount.data?.toString() ?? "0";
  const distributionResult = api.results.distribution.useQuery({ totalTokens });

  const getEvents = useCallback(async () => {
    if (!publicClient || !pool) return;

    const events = await publicClient.getContractEvents({
      abi: abi,
      address: pool.strategy as `0x${string}`,
      eventName: "Distributed",
      strict: true,
      fromBlock: 0n,
      toBlock: "latest",
    });

    const payoutEventsByTransaction: Record<string, Payout[]> = {};

    events.forEach((event) => {
      const { args, transactionHash } = event;
      if (!payoutEventsByTransaction[transactionHash]) {
        payoutEventsByTransaction[transactionHash] = [];
      }
      payoutEventsByTransaction[transactionHash].push({
        projectId: args.recipientId,
        sender: args.sender,
        amount: Number(args.amount) / 1e18,
      } as Payout);
    });
    setExplorerUrl(
      explorerLinks[round.data?.network as keyof typeof explorerLinks],
    );

    setPayoutsByTransaction(payoutEventsByTransaction);
    setFetched(true);
  }, [publicClient, pool]);

  useEffect(() => {
    if (pool && publicClient && !fetched) {
      getEvents();
    }
  }, [pool, publicClient, fetched, getEvents]);

  return {
    payoutsByTransaction,
    fetched,
    distributionResult,
    poolAmount,
    token,
    explorerUrl,
  };
}
