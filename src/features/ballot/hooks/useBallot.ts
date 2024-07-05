import { useMutation } from "@tanstack/react-query";
import { useBeforeUnload } from "react-use";
import { useChainId, useSignTypedData } from "wagmi";
import type { Allocation } from "~/features/ballot/types";

import { ballotTypedData } from "~/utils/typedData";
import { api } from "~/utils/api";
import { keccak256 } from "viem";
import { useBallot } from "~/features/ballotV2/hooks/useBallot";

export function useSubmitBallot({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) {
  const chainId = useChainId();
  const { refetch } = useBallot();

  const { mutateAsync, isPending } = api.ballotV2.publish.useMutation({
    onSuccess,
  });
  useBeforeUnload(isPending, "You have unsaved changes, are you sure?");

  const { signTypedDataAsync } = useSignTypedData();

  return useMutation({
    mutationFn: async () => {
      if (chainId) {
        const { data: ballot } = await refetch();

        const message = {
          allocations_sum: BigInt(sumBallot(ballot?.allocations)),
          allocations_count: BigInt(ballot?.allocations?.length ?? 0),
          hashed_allocations: keccak256(
            Buffer.from(JSON.stringify(ballot?.allocations)),
          ),
        };
        const signature = await signTypedDataAsync({
          ...ballotTypedData(chainId),
          message,
        });

        return mutateAsync({ signature, message, chainId });
      }
    },
  });
}

export const sumBallot = (allocations?: Allocation[]) =>
  (allocations ?? []).reduce(
    (sum, x) => sum + (!isNaN(Number(x?.amount)) ? Number(x.amount) : 0),
    0,
  );
