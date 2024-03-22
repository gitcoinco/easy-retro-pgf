import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";

export function useApprovedApplications(ids?: string[]) {
  return api.applications.approvals.useQuery({ ids });
}
