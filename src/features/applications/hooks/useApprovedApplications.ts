import { api } from "~/utils/api";

export function useApprovedApplications(ids?: string[]) {
  return api.applications.approvals.useQuery(
    { ids },
    {
      staleTime: 0,
      gcTime: 1000,
      enabled: false,
    },
  );
}
