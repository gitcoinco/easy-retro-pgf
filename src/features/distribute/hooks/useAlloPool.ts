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
import {
  allo,
  allo as alloConfig,
  config,
  isNativeToken,
  nativeToken,
} from "~/config";
import { useMutation } from "@tanstack/react-query";
import { useAllo, waitForLogs } from "./useAllo";
import { parseAbi } from "viem";

export function usePoolId() {
  return useContractRead({
    address: allo.strategyAddress,
    abi: parseAbi(["function getPoolId() external view returns (uint256)"]),
    functionName: "getPoolId",
  });
}

export function usePoolAmount() {
  return useContractRead({
    address: allo.strategyAddress,
    abi: parseAbi(["function getPoolAmount() external view returns (uint256)"]),
    functionName: "getPoolAmount",
  });
}

export function useCreatePool() {
  const allo = useAllo();
  const { sendTransactionAsync } = useSendTransaction();
  const client = usePublicClient();
  return useMutation(
    async (params: { profileId: string; initialFunding?: bigint }) => {
      if (!allo) throw new Error("Allo not initialized");

      const tx = allo.createPoolWithCustomStrategy({
        profileId: params.profileId,
        strategy: alloConfig.strategyAddress,
        token: alloConfig.tokenAddress,
        managers: config.admins,
        amount: params.initialFunding ?? 0n,
        metadata: { protocol: 1n, pointer: "" },
        initStrategyData: "",
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
  return useMutation(
    async ({ amount, poolId }: { amount: bigint; poolId: number }) => {
      if (!allo) throw new Error("Allo not initialized");

      const { to, value } = allo.fundPool(poolId, Number(amount));
      return sendTransactionAsync({ to, value: BigInt(value) });
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
    address: isNativeToken ? undefined : alloConfig.tokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address!, alloConfig.alloAddress],
    enabled: alloConfig.tokenAddress !== nativeToken,
  });
}

export function useApprove() {
  return useContractWrite({
    address: isNativeToken ? undefined : alloConfig.tokenAddress,
    abi: erc20ABI,
    functionName: "approve",
  });
}
export function useTokenBalance() {
  const { address } = useAccount();
  return useBalance({
    address,
    token:
      alloConfig.tokenAddress === nativeToken
        ? undefined
        : alloConfig.tokenAddress,
  });
}
