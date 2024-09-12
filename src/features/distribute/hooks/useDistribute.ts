import { useMutation } from "@tanstack/react-query";
import { useAllo } from "./useAllo";
import { usePoolId } from "./useAlloPool";
import { type Address, encodeAbiParameters, parseAbiParameters } from "viem";
import { useSendTransaction } from "wagmi";
import { uuidToBytes32 } from "~/utils/uuid";

export function useDistribute() {
  const allo = useAllo();
  const { data: poolId } = usePoolId();

  const { sendTransactionAsync } = useSendTransaction();
  return useMutation({
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

      return sendTransactionAsync({ to, data });
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
