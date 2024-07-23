import { useIsMutating } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useBallotContext } from "~/features/ballot/components/provider";
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

export function useIsSavingBallot() {
  return Boolean(useIsMutating({ mutationKey: getQueryKey(api.ballotV2) }));
}

export function useBallotWeightSum() {
  const { ballot } = useBallotContext();
  return Math.round(
    ballot?.allocations.reduce((sum, x) => (sum += Number(x.amount)), 0) ?? 0,
  );
}
