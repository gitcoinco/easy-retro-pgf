import { api } from "~/utils/api";

export function useApprovedApplications(ids: string[]) {
  return api.applications.approvals.useQuery({ ids });
}
