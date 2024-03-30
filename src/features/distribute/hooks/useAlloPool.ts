import {
  useAccount,
  useBalance,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useSendTransaction,
  useWriteContract,
} from "wagmi";
import { type Address, parseAbi, erc20Abi } from "viem";
import { abi as AlloABI } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import { allo, config, isNativeToken, nativeToken } from "~/config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAllo, waitForLogs } from "./useAllo";
import { api } from "~/utils/api";
import { useWatch } from "~/hooks/useWatch";

export function usePoolId() {
  const config = api.config.get.useQuery();
  return {
    ...config,
    data: config.data?.poolId,
  };
}

export function usePool(poolId?: number) {
  const allo = useAllo();

  return useQuery({
    queryKey: ["pool", poolId],
    queryFn: async () => allo?.getPool(BigInt(poolId!)),
    enabled: Boolean(allo && poolId),
  });
}
export function usePoolAmount() {
  const { data: poolId } = usePoolId();
  const { data: pool } = usePool(poolId);

  const query = useReadContract({
    address: pool?.strategy as Address,
    abi: parseAbi(["function getPoolAmount() external view returns (uint256)"]),
    functionName: "getPoolAmount",
    query: { enabled: Boolean(pool?.strategy) },
  });

  useWatch(query.queryKey);

  return query;
}

export function useCreatePool() {
  const alloSDK = useAllo();
  const setPool = api.config.setPoolId.useMutation();
  const { sendTransactionAsync } = useSendTransaction();
  const client = usePublicClient();
  const utils = api.useUtils();

  return useMutation({
    mutationFn: async (params: {
      profileId: string;
      initialFunding?: bigint;
    }) => {
      if (!alloSDK) throw new Error("Allo not initialized");

      const tx = alloSDK.createPool({
        profileId: params.profileId as Address,
        strategy: allo.strategyAddress,
        token: allo.tokenAddress,
        managers: config.admins,
        amount: params.initialFunding ?? 0n,
        metadata: { protocol: 1n, pointer: "" },
        initStrategyData: "0x",
      });
      const value = BigInt(tx.value);
      const hash = await sendTransactionAsync({ ...tx, value });

      return waitForLogs(hash, AlloABI, client).then((logs) => {
        const { poolId } = (logs?.find(
          (log) => log?.eventName === "PoolCreated",
        )?.args ?? {}) as { poolId?: bigint };

        if (poolId) {
          setPool.mutate(
            { poolId: Number(poolId) },
            {
              onSuccess() {
                utils.config.get.invalidate().catch(console.log);
              },
            },
          );
        }
      });
    },
  });
}

export function useFundPool() {
  const allo = useAllo();
  const { sendTransactionAsync } = useSendTransaction();
  const client = usePublicClient();

  return useMutation({
    mutationFn: async ({
      amount,
      poolId,
    }: {
      amount: bigint;
      poolId: number;
    }) => {
      if (!allo) throw new Error("Allo not initialized");

      const { to, data, value } = allo.fundPool(BigInt(poolId), amount);
      const hash = await sendTransactionAsync({
        to,
        data,
        value: BigInt(value),
      });

      return waitForLogs(hash, AlloABI, client);
    },
  });
}

export function usePoolToken() {
  const token = useReadContracts({
    allowFailure: false,
    contracts: ["decimals", "symbol"].map((functionName) => ({
      address: isNativeToken ? undefined : allo.tokenAddress,
      abi: erc20Abi,
      functionName,
    })),
  });
  return {
    ...token,
    data: {
      ...token.data,
      isNativeToken,
      symbol: isNativeToken ? "ETH" : token.data?.[1] ?? "",
      decimals: token.data?.[0] ?? 18,
    },
  };
}

export function useTokenAllowance() {
  const { address } = useAccount();
  const query = useReadContract({
    address: isNativeToken ? undefined : allo.tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, allo.alloAddress],
    query: {
      enabled: allo.tokenAddress !== nativeToken,
    },
  });

  useWatch(query.queryKey);

  return query;
}

export function useApprove() {
  const { writeContractAsync } = useWriteContract();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (isNativeToken) return null;
      return writeContractAsync({
        abi: erc20Abi,
        address: allo.tokenAddress,
        functionName: "approve",
        args: [allo.alloAddress, amount],
      });
    },
  });
}
export function useTokenBalance() {
  const { address } = useAccount();
  const query = useBalance({
    address,
    token: allo.tokenAddress === nativeToken ? undefined : allo.tokenAddress,
  });

  useWatch(query.queryKey);

  return query;
}
