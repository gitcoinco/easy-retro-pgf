import { api } from "~/utils/api";
import { usePoolAmount, usePool, usePoolToken } from "../hooks/useAlloPool";
import { usePublicClient } from "wagmi";
import { abi } from "~/lib/rpgf/abi";
import { type Payout } from "~/features/distribute/types";
import { explorerLinks } from "~/config";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { useQuery } from "@tanstack/react-query";
import { uuidToBytes32 } from "~/utils/uuid";
import { type Distribution } from "~/features/distribute/types";
export function useDistributeInfo(
  poolId: number | undefined | null,
  importedDistributions?: Distribution[] | undefined,
) {
  const round = useCurrentRound();
  const publicClient = usePublicClient();
  const poolAmount = usePoolAmount();
  const token = usePoolToken();
  const { data: pool } = usePool(poolId!);
  const totalTokens = poolAmount.data?.toString() ?? "0";
  const distributionResult = api.results.distribution.useQuery({ totalTokens });
  const distributionResultData =
    importedDistributions && importedDistributions.length > 0
      ? importedDistributions
      : distributionResult.data?.distributions;

  return useQuery({
    queryKey: ["distribute-info", poolId],
    enabled: !!(poolId && pool && distributionResultData),
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
      const alreadyDistributedProjects: Record<string, boolean> = {};

      events.forEach((event) => {
        const { args, transactionHash } = event;
        if (!payoutEventsByTransaction[transactionHash]) {
          payoutEventsByTransaction[transactionHash] = [];
        }
        if (!alreadyDistributedProjects[args.recipientId]) {
          alreadyDistributedProjects[args.recipientId] = true;
        }
        // find name of projectId from the distributionResult
        const name = distributionResultData?.find(
          (project) => uuidToBytes32(project.projectId) === args.recipientId,
        )?.name;
        payoutEventsByTransaction[transactionHash].push({
          name: name ?? "Unknown",
          payoutAddress: args.recipientAddress,
          projectId: args.recipientId,
          sender: args.sender,
          amount: Number(args.amount),
        } as Payout);
      });

      const distributions = distributionResultData?.filter(
        (project) =>
          !alreadyDistributedProjects[uuidToBytes32(project.projectId)],
      );

      return {
        token,
        poolAmount,
        distributionResult,
        distributions,
        payoutEventsByTransaction,
        explorerLink:
          explorerLinks[round.data?.network as keyof typeof explorerLinks],
        round: round.data,
      };
    },
  });
}
