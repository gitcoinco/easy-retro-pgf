import { api } from "~/utils/api";

export function useApprovedApplications(
  ids?: string[],
  opts: {
    staleTime?: number;
    gcTime?: number;
    enabled?: boolean;
    noCache?: boolean;
  } = {},
) {
  return api.applications.approvals.useQuery(
    { ids, noCache: opts.noCache ?? false },
    {
      staleTime: opts.staleTime ?? 0,
      gcTime: opts.gcTime ?? 1000,
      enabled: opts.enabled ?? false,
    },
  );
}
