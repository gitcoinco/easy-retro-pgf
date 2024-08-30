import { api } from "~/utils/api";

export function useApplicationStatus({
  projectId = "",
  withAttestations = false,
  opts = {},
}: {
  projectId?: string;
  withAttestations?: boolean;
  opts?: {
    staleTime?: number;
    refetchInterval?: number;
    gcTime?: number;
    enabled?: boolean;
    noCache?: boolean;
  };
}) {
  return api.applications.status.useQuery(
    { projectId, withAttestations },
    {
      staleTime: opts.staleTime ?? 0,
      refetchInterval: opts.refetchInterval,
      gcTime: opts.gcTime,
      enabled: opts.enabled,
    },
  );
}
