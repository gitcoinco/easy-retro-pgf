import {
  useAccount,
  useBalance,
  usePublicClient,
  useSendTransaction,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { abi as AlloABI } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import { allo, config, isNativeToken, nativeToken } from "~/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAllo, waitForLogs } from "./useAllo";
import { type Address, parseAbi, erc20Abi } from "viem";
import { api } from "~/utils/api";
import { useCallback } from "react";

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

  return useReadContract({
    address: pool?.strategy as Address,
    abi: parseAbi(["function getPoolAmount() external view returns (uint256)"]),
    functionName: "getPoolAmount",
    query: {
      enabled: Boolean(pool?.strategy),
    },
  });
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

      return waitForLogs(hash, AlloABI, client!).then((logs) => {
        const { poolId } = (logs.find((log) => log?.eventName === "PoolCreated")
          ?.args ?? {}) as { poolId?: bigint };

        if (poolId) {
          setPool.mutate(
            {
              poolId: Number(poolId),
              config: { calculation: { style: "op" } },
            },
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
  const queryClient = useQueryClient();
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

      console.log("fund pool, ,", poolId, amount);
      const { to, data, value } = allo.fundPool(BigInt(poolId), amount);
      const hash = await sendTransactionAsync({
        to,
        data,
        value: BigInt(value),
      });

      return waitForLogs(hash, AlloABI, client!).then(async (logs) => {
        await queryClient.invalidateQueries({
          queryKey: ["allo/registry/member"],
        });

        return logs;
      });
    },
  });
}

export function usePoolToken() {
  const token = useReadContract({
    abi: erc20Abi,
    address: isNativeToken ? undefined : allo.tokenAddress,
  });

  const data = token.data as { symbol: string; decimals: number } | undefined;

  const symbol = data?.symbol ?? "";
  const decimals = data?.decimals ?? 18;

  return {
    ...token,
    data: {
      ...(data ?? {}),
      symbol: isNativeToken ? "ETH" : symbol,
      decimals,
    },
  };
}

export function useTokenAllowance() {
  const { address } = useAccount();

  return useReadContract({
    address: isNativeToken ? undefined : allo.tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, allo.alloAddress],
    query: {
      enabled: allo.tokenAddress !== nativeToken,
    },
  });
}

export function useApprove() {
  const write = useWriteContract();

  const onApprove = useCallback(
    (address: Address, amount: bigint) =>
      isNativeToken
        ? write.writeContract({
            address: allo.tokenAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [address, amount],
          })
        : undefined,
    [write.writeContract],
  );

  return { ...write, onApprove };
}
export function useTokenBalance() {
  const { address } = useAccount();

  return useBalance({
    address,
    token: allo.tokenAddress === nativeToken ? undefined : allo.tokenAddress,
  });
}
