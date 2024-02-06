import { usePublicClient, useSendTransaction } from "wagmi";
import { abi as AlloABI } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import { allo as alloConfig, config } from "~/config";
import { useMutation } from "@tanstack/react-query";
import { useAllo, waitForLogs } from "./useAllo";

export function useCreatePool() {
  const allo = useAllo();
  const { sendTransactionAsync } = useSendTransaction();
  const client = usePublicClient();
  return useMutation(
    async (params: { profileId: string; initialFunding?: number }) => {
      if (!allo) throw new Error("Allo not initialized");

      const tx = allo.createPoolWithCustomStrategy({
        profileId: params.profileId,
        strategy: alloConfig.strategyAddress,
        token: alloConfig.tokenAddress,
        managers: config.admins,
        amount: BigInt(params.initialFunding ?? 0),
        metadata: { protocol: 1n, pointer: "" },
        initStrategyData: "",
      });
      const value = BigInt(tx.value);
      const { hash } = await sendTransactionAsync({ ...tx, value });

      return waitForLogs(hash, AlloABI, client);
    },
  );
}
