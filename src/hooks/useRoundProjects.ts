import type { Application } from "~/features/applications/types";
import { api } from "~/utils/api";

export function useRoundProjects({ round }: { round: string }) {
  const query = api.projects.roundProjectsWithMetadata.useQuery({
    round,
  });

  return {
    ...query,
    data: query.data as unknown as Application[] | undefined,
  };
}
