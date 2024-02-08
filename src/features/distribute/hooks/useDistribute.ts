import { useMutation } from "@tanstack/react-query";
import { type Distribution } from "../types";
import { useAllo } from "./useAllo";
import { usePoolId } from "./useAlloPool";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { useSendTransaction } from "wagmi";

export function useDistribute() {
  const allo = useAllo();
  const { data: poolId } = usePoolId();
  const { sendTransactionAsync } = useSendTransaction();
  return useMutation(async (votes: Distribution[]) => {
    if (!allo) throw new Error("Allo not initialized");

    const { recipients, amounts } = votes.reduce(
      (acc, x) => ({
        recipients: acc.recipients.concat(x.payoutAddress),
        amounts: acc.amounts.concat(BigInt(x.amount)),
      }),
      { recipients: [], amounts: [] } as {
        recipients: string[];
        amounts: bigint[];
      },
    );

    const { to, data } = allo.distribute(
      Number(poolId),
      recipients,
      encodeAmounts(amounts),
    );

    return sendTransactionAsync({ to, data });
  });
}

function encodeAmounts(amounts: bigint[]) {
  return encodeAbiParameters(parseAbiParameters("uint256[]"), [amounts]);
}
