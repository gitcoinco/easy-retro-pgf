import { useMutation } from "@tanstack/react-query";
import { useAllo, waitForLogs } from "./useAllo";
import { usePoolId } from "./useAlloPool";
import { abi as AlloABI } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import { type Address, encodeAbiParameters, parseAbiParameters } from "viem";
import { usePublicClient, useSendTransaction } from "wagmi";
import { uuidToBytes32 } from "~/utils/uuid";
import { toast } from "sonner";

export function useDistribute(message?: string) {
  const allo = useAllo();
  const { data: poolId } = usePoolId();
  const client = usePublicClient();

  const { sendTransactionAsync } = useSendTransaction();
  return useMutation({
    onSuccess: () => {
      toast.success("Distributed successfully!", { description: message });
    },
    onError: (err: { reason?: string; data?: { message: string } }) =>
      toast.error("Distribution error", {
        description: err.reason ?? err.data?.message,
      }),
    mutationFn: async ({
      projectIds,
      recipients,
      amounts,
    }: {
      projectIds: `0x${string}`[];
      recipients: Address[];
      amounts: bigint[];
    }) => {
      if (!allo) throw new Error("Allo not initialized");
      if (!poolId) throw new Error("PoolID is required");

      console.log({ recipients, amounts });
      const { to, data } = allo.distribute(
        BigInt(poolId),
        recipients,
        encodeData(amounts, projectIds),
      );

      try {
        const hash = await sendTransactionAsync({
          to,
          data,
          value: 0n,
        });

        return waitForLogs(hash, AlloABI, client);
      } catch (error) {
        throw { reason: "Failed to Distribute" };
      }
    },
  });
}

function encodeData(amounts: bigint[], projectIds: `0x${string}`[]) {
  const _projectIds = projectIds.map((id) => uuidToBytes32(id)) as any[];
  return encodeAbiParameters(parseAbiParameters("uint256[],bytes32[]"), [
    amounts,
    _projectIds,
  ]);
}

// function encodeAmounts(amounts: bigint[]) {
//   return encodeAbiParameters(parseAbiParameters("uint256[]"), [amounts]);
// }
