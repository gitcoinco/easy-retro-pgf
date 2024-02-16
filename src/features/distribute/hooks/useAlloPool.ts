import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePublicClient,
  useSendTransaction,
  useToken,
  useWaitForTransaction,
} from "wagmi";
import { abi as AlloABI } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import { allo, config, isNativeToken, nativeToken } from "~/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAllo, waitForLogs } from "./useAllo";
import { type Address, parseAbi } from "viem";
import { ethers } from "ethers";
import { type Fragment } from "ethers/lib/utils";

export function usePoolId() {
  return useContractRead({
    address: allo.customStrategy,
    abi: parseAbi(["function getPoolId() external view returns (uint256)"]),
    functionName: "getPoolId",
  });
}

export function usePoolAmount() {
  return useContractRead({
    address: allo.customStrategy,
    abi: parseAbi(["function getPoolAmount() external view returns (uint256)"]),
    functionName: "getPoolAmount",
    watch: true,
  });
}

function useWaitForEvent<T>(event: string, abi: unknown, hash?: Address) {
  const tx = useWaitForTransaction({ hash, enabled: Boolean(hash) });
  const iface = new ethers.utils.Interface(abi as Fragment[]);

  const data = tx.data?.logs
    .map((log) => {
      try {
        return iface.parseLog(log);
      } catch (error) {
        return null;
      }
    })
    .find((log) => log?.name === event) as { args: T } | undefined;

  return {
    ...tx,
    data,
  };
}

export function useCreatePool() {
  const create = useContractWrite({
    address: allo.strategyAddress,
    abi: parseAbi([
      "function createPool(bytes32 _profileId, address _token,uint256 _amount, address[] memory _managers) public",
    ]),
    functionName: "createPool",
  });

  const event = useWaitForEvent<{ strategy: string }>(
    "PoolCreated",
    AlloABI,
    create.data?.hash,
  );

  return {
    ...create,
    isLoading: create.isLoading || event.isLoading,
    data: event.data?.args?.strategy,
  };

  const alloSDK = useAllo();
  const { sendTransactionAsync } = useSendTransaction();
  const client = usePublicClient();
  return useMutation(
    async (params: { profileId: string; initialFunding?: bigint }) => {
      if (!alloSDK) throw new Error("Allo not initialized");

      const tx = alloSDK.createPoolWithCustomStrategy({
        profileId: params.profileId,
        strategy: allo.strategyAddress,
        token: allo.tokenAddress,
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
  const queryClient = useQueryClient();
  const client = usePublicClient();

  return useMutation(
    async ({ amount, poolId }: { amount: bigint; poolId: number }) => {
      if (!allo) throw new Error("Allo not initialized");

      console.log("fund pool, ,", poolId, amount);
      const { to, value } = allo.fundPool(poolId, Number(amount));
      const { hash } = await sendTransactionAsync({ to, value: BigInt(value) });

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
