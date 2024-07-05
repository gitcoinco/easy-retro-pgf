import { useMutation } from "@tanstack/react-query";
import { useBeforeUnload } from "react-use";
import { useChainId, useSignTypedData } from "wagmi";
import type { Allocation } from "~/features/ballot/types";

import { ballotTypedData } from "~/utils/typedData";
import { keccak256 } from "viem";

import { useIsMutating } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useBallotContext } from "~/features/ballot/components/BallotProvider";
import { api } from "~/utils/api";

export function useBallot() {
  return api.ballotV2.get.useQuery();
}

export function useSaveAllocation() {
  const utils = api.useUtils();
  return api.ballotV2.save.useMutation({
    // Refetch the ballot to update the UI
    onSuccess: (ballot) => {
      utils.ballotV2.get.setData(undefined, ballot);
      utils.metrics.forBallot.invalidate();
    },
  });
}

export function useRemoveAllocation() {
  const utils = api.useUtils();
  return api.ballotV2.remove.useMutation({
    // Refetch the ballot to update the UI
    onSuccess: (ballot) => {
      utils.ballotV2.get.setData(undefined, ballot);
      utils.metrics.forBallot.invalidate();
    },
  });
}
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

export function useIsSavingBallot() {
  return Boolean(useIsMutating({ mutationKey: getQueryKey(api.ballotV2) }));
}

export function useBallotWeightSum() {
  const { ballot } = useBallotContext();
  return Math.round(
    ballot?.allocations.reduce((sum, x) => (sum += Number(x.amount)), 0) ?? 0,
  );
}
