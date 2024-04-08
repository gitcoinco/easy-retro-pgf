import {
  useAccount,
  useBalance,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useSendTransaction,
  useWriteContract,
} from "wagmi";

import { type Address, parseAbi, erc20Abi, getAddress } from "viem";
import { abi as AlloABI } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import { allo, nativeToken, type networks, supportedNetworks } from "~/config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAllo, waitForLogs } from "./useAllo";
import { api } from "~/utils/api";
import { useWatch } from "~/hooks/useWatch";
import {
  useCurrentDomain,
  useCurrentRound,
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

  return useQuery({
    queryKey: ["pool", { domain, poolId }],
    queryFn: async () => allo?.getPool(BigInt(poolId)),
    enabled: Boolean(allo && poolId),
  });
}
export function usePoolAmount() {
  const { data: poolId } = usePoolId();
  const { data: pool } = usePool(poolId!);

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
  const { data: round } = useCurrentRound();

  const alloSDK = useAllo();
  const update = useUpdateRound();
  const { sendTransactionAsync } = useSendTransaction();
  const client = usePublicClient();
  const utils = api.useUtils();

  return useMutation({
    mutationFn: async (params: {
      profileId: string;
      initialFunding?: bigint;
    }) => {
      if (!alloSDK) throw new Error("Allo not initialized");
      if (!round) throw new Error("Round not loaded");
      const network = round.network as keyof typeof networks;
      const strategy = allo.strategyAddress[network];

      if (!strategy) throw new Error("No strategy contract found");

      // This will properly cast the type into address (and also validate)
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const token = getAddress(round.tokenAddress || nativeToken);
      const managers = round.admins.map(getAddress);

      const tx = alloSDK.createPool({
        profileId: params.profileId as Address,
        strategy,
        token,
        managers,
        amount: params.initialFunding ?? 0n,
        // TODO: We could point this to an http endpoint that returns the round details
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

function useToken(tokenAddress?: Address) {
  const { address } = useAccount();
  const { data: round } = useCurrentRound();
  const isNativeToken = !tokenAddress || tokenAddress === nativeToken;
  const tokenContract = {
    address: isNativeToken ? undefined : tokenAddress,
    abi: erc20Abi,
  };
  const { data: balance } = useBalance({
    address,
    token: tokenContract.address,
  });

  const network = supportedNetworks.find((n) => n.chain === round?.network);
  const token = useReadContracts({
    allowFailure: false,
    contracts: [
      { ...tokenContract, functionName: "decimals" },
      { ...tokenContract, functionName: "symbol" },
      {
        ...tokenContract,
        functionName: "allowance",
        args: [address!, allo.alloAddress],
      },
    ],
  });

  const [decimals = network?.nativeCurrency.decimals ?? 18, symbol, allowance] =
    (token.data ?? []) as [number, string, bigint];
  return {
    ...token,
    data: {
      address,
      isNativeToken,
      symbol: isNativeToken ? network?.nativeCurrency.name : symbol ?? "",
      balance: balance?.value ?? 0n,
      decimals,
      allowance,
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

  const query = useReadContract({
    //   address: data.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, allo.alloAddress],
    query: {
      enabled: Boolean(data.address),
    },
  });

  useWatch(query.queryKey);

  return query;
}

export function useApprove() {
  const { data } = useRoundToken();

  const { writeContractAsync } = useWriteContract();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!data.address) return null;
      return writeContractAsync({
        abi: erc20Abi,
        address: data.address,
        functionName: "approve",
        args: [allo.alloAddress, amount],
      });
    },
  });
}
