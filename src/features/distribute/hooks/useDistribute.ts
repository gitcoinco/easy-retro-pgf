import { useMutation } from "@tanstack/react-query";
import { useAllo } from "./useAllo";
import { usePoolId } from "./useAlloPool";
import { type Address, encodeAbiParameters, parseAbiParameters } from "viem";
import { useSendTransaction } from "wagmi";

export function useDistribute() {
  const allo = useAllo();
  const { data: poolId } = usePoolId();

  const { sendTransactionAsync } = useSendTransaction();
  return useMutation(
    async ({
      recipients,
      amounts,
    }: {
      recipients: Address[];
      amounts: bigint[];
    }) => {
      if (!allo) throw new Error("Allo not initialized");
      if (!poolId) throw new Error("Pool ID not found");

      console.log({ recipients, amounts });
      const { to, data } = allo.distribute(
        BigInt(poolId),
        recipients,
        encodeAmounts(amounts),
      );

      return sendTransactionAsync({ to, data });
    },
  );
}

function encodeAmounts(amounts: bigint[]) {
  return encodeAbiParameters(parseAbiParameters("uint256[]"), [amounts]);
}
