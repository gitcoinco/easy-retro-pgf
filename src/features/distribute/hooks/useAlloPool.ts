import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePublicClient,
  useSendTransaction,
  useToken as useWagmiToken,
} from "wagmi";
import { type Address, parseAbi, getAddress } from "viem";
import { abi as AlloABI } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import { allo, nativeToken } from "~/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAllo, waitForLogs } from "./useAllo";
import { api } from "~/utils/api";
import {
  useCurrentRound,
  useCurrentDomain,
  useUpdateRound,
} from "~/features/rounds/hooks/useRound";

export function usePoolId() {
  const round = useCurrentRound();
  return {
    ...round,
    data: round.data?.poolId,
  };
}

export function usePool(poolId: number) {
  const allo = useAllo();
  const domain = useCurrentDomain();

  return useQuery(
    ["pool", domain, poolId],
    async () => allo?.getPool(BigInt(poolId)),
    { enabled: Boolean(allo && poolId) },
  );
}
export function usePoolAmount() {
  const { data: poolId } = usePoolId();
  const { data: pool } = usePool(poolId!);

  return useContractRead({
    address: pool?.strategy as Address,
    abi: parseAbi(["function getPoolAmount() external view returns (uint256)"]),
    functionName: "getPoolAmount",
    watch: true,
    enabled: Boolean(pool?.strategy),
  });
}

export function useCreatePool() {
  const { data: round } = useCurrentRound();

  const alloSDK = useAllo();
  const update = useUpdateRound();
  const { sendTransactionAsync } = useSendTransaction();
  const client = usePublicClient();
  const utils = api.useUtils();
  return useMutation(
    async (params: { profileId: string; initialFunding?: bigint }) => {
      if (!alloSDK) throw new Error("Allo not initialized");
      if (!round?.tokenAddress) throw new Error("Token address not configured");

      // This will properly cast the type into address (and also validate)
      const token = getAddress(round.tokenAddress);
      const managers = round.admins.map(getAddress);

      const tx = alloSDK.createPool({
        profileId: params.profileId as Address,
        strategy: allo.strategyAddress,
        token,
        managers,
        amount: params.initialFunding ?? 0n,
        // TODO: We could point this to an http endpoint that returns the round details
        metadata: { protocol: 1n, pointer: "" },
        initStrategyData: "0x",
      });
      const value = BigInt(tx.value);
      const { hash } = await sendTransactionAsync({ ...tx, value });

      return waitForLogs(hash, AlloABI, client).then((logs) => {
        const { poolId } = (logs.find((log) => log?.eventName === "PoolCreated")
          ?.args ?? {}) as { poolId?: bigint };

        if (poolId) {
          update.mutate(
            { poolId: Number(poolId) },
            {
              async onSuccess() {
                return utils.rounds.invalidate();
              },
            },
          );
        }
      });
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

function useToken(address?: Address) {
  const token = useWagmiToken({ address, enabled: Boolean(address) });
  const isNativeToken = !address || address === nativeToken;
  return {
    ...token,
    data: {
      ...token.data,
      isNativeToken,
      address: isNativeToken ? undefined : address,
      symbol: isNativeToken ? "ETH" : token.data?.symbol ?? "",
      decimals: token.data?.decimals ?? 18,
    },
  };
}
export function useRoundToken() {
  const { data: round } = useCurrentRound();
  const address = round?.tokenAddress
    ? getAddress(round?.tokenAddress ?? "")
    : undefined;
  return useToken(address);
}

export function usePoolToken() {
  const { data: poolId } = usePoolId();
  const { data: pool } = usePool(poolId!);

  return useToken(pool?.token);
}

export function useTokenAllowance() {
  const { address } = useAccount();
  const { data } = useRoundToken();

  return useContractRead({
    address: data.address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address!, allo.alloAddress],
    enabled: Boolean(data.address),
    watch: true,
  });
}

export function useApprove() {
  const { data } = useRoundToken();

  return useContractWrite({
    address: data.address,
    abi: erc20ABI,
    functionName: "approve",
  });
}
export function useTokenBalance() {
  const { address } = useAccount();
  const { data } = useRoundToken();

  return useBalance({ address, token: data.address, watch: true });
}
