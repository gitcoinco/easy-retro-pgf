import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePublicClient,
  useSendTransaction,
  useToken,
} from "wagmi";
import { abi as AlloABI } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import { allo, config, isNativeToken, nativeToken } from "~/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAllo, waitForLogs } from "./useAllo";
import { type Address, parseAbi } from "viem";

export function usePoolId() {
  // TODO: Store in config database
  return { data: 28 };
}

export function usePool(poolId: number) {
  const allo = useAllo();

  return useQuery(["pool", poolId], async () => allo?.getPool(BigInt(poolId)), {
    enabled: Boolean(allo && poolId),
  });
}
export function usePoolAmount() {
  const { data: poolId } = usePoolId();
  const { data: pool } = usePool(poolId);

  return useContractRead({
    address: pool?.strategy as Address,
    abi: parseAbi(["function getPoolAmount() external view returns (uint256)"]),
    functionName: "getPoolAmount",
    watch: true,
    enabled: Boolean(pool?.strategy),
  });
}

export function useCreatePool() {
  const alloSDK = useAllo();
  const { sendTransactionAsync } = useSendTransaction();
  const client = usePublicClient();
  return useMutation(
    async (params: { profileId: string; initialFunding?: bigint }) => {
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
      const { hash } = await sendTransactionAsync({ ...tx, value });

      return waitForLogs(hash, AlloABI, client);
    },
  );
}

export function useFundPool() {
  const allo = useAllo();
  const { sendTransactionAsync } = useSendTransaction();
  const queryClient = useQueryClient();
  const client = usePublicClient();

  return useMutation(
    async ({ amount, poolId }: { amount: bigint; poolId: number }) => {
      if (!allo) throw new Error("Allo not initialized");

      console.log("fund pool, ,", poolId, amount);
      const { to, data, value } = allo.fundPool(BigInt(poolId), amount);
      const { hash } = await sendTransactionAsync({
        to,
        data,
        value: BigInt(value),
      });

      return waitForLogs(hash, AlloABI, client).then(async (logs) => {
        await queryClient.invalidateQueries(["allo/registry/member"]);
        return logs;
      });
    },
  );
}

export function usePoolToken() {
  const token = useToken({
    address: isNativeToken ? undefined : allo.tokenAddress,
  });
  return {
    ...token,
    data: {
      ...token.data,
      symbol: isNativeToken ? "ETH" : token.data?.symbol ?? "",
      decimals: token.data?.decimals ?? 18,
    },
  };
}

export function useTokenAllowance() {
  const { address } = useAccount();
  return useContractRead({
    address: isNativeToken ? undefined : allo.tokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address!, allo.alloAddress],
    enabled: allo.tokenAddress !== nativeToken,
    watch: true,
  });
}

export function useApprove() {
  return useContractWrite({
    address: isNativeToken ? undefined : allo.tokenAddress,
    abi: erc20ABI,
    functionName: "approve",
  });
}
export function useTokenBalance() {
  const { address } = useAccount();
  return useBalance({
    address,
    watch: true,
    token: allo.tokenAddress === nativeToken ? undefined : allo.tokenAddress,
  });
}
