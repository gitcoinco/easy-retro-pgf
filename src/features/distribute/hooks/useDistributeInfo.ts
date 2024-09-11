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
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";

export function useDistributeInfo() {
  const round = useCurrentRound();
  const publicClient = usePublicClient();
  const { data: poolId } = usePoolId();
  const poolAmount = usePoolAmount();
  const token = usePoolToken();
  const { data: pool } = usePool(poolId!);

  const totalTokens = poolAmount.data?.toString() ?? "0";
  const distributionResult = api.results.distribution.useQuery({ totalTokens });

  return useQuery({
    queryKey: ["distribute-info", poolId],
    enabled: !!(poolId && pool && distributionResult.data && poolAmount.data),
    queryFn: async () => {
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
          amount: Number(formatUnits(args.amount, token.data.decimals ?? 1e18)),
        } as Payout);
      });

      return {
        token,
        poolAmount,
        distributionResult,
        payoutEventsByTransaction,
        explorerLink:
          explorerLinks[round.data?.network as keyof typeof explorerLinks],
        round: round.data,
      };
    },
  });
}
