import { api } from "~/utils/api";

export function useBallot() {
  return api.ballotV2.get.useQuery();
}

export function useSaveAllocation() {
  const utils = api.useUtils();
  return api.ballotV2.save.useMutation({
    // Refetch the ballot to update the UI
    onSuccess: () => utils.ballotV2.get.invalidate(),
  });
}

export function useRemoveAllocation() {
  const utils = api.useUtils();
  return api.ballotV2.remove.useMutation({
    // Refetch the ballot to update the UI
    onSuccess: () => utils.ballotV2.get.invalidate(),
  });
}
