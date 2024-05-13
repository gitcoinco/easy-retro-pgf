import { useMetadata } from "~/hooks/useMetadata";
import { api } from "~/utils/api";
import { type Application } from "~/features/applications/types";
import { useFilter } from "~/features/filter/hooks/useFilter";
import { type Filter } from "~/features/filter/types";
import { useMemo } from "react";
import type { Ballot } from "~/features/ballot/types";

export function useProjectById(id: string) {
  const query = api.projects.get.useQuery(
    { ids: [id] },
    { enabled: Boolean(id) },
  );

  return { ...query, data: query.data?.[0] };
}

export function useProjectsById(ids: string[]) {
  return api.projects.get.useQuery({ ids }, { enabled: Boolean(ids.length) });
}

const seed = 0;
export function useSearchProjects(filterOverride?: Partial<Filter>) {
  const { ...filter } = useFilter();

  return api.projects.search.useInfiniteQuery(
    { seed, ...filter, ...filterOverride },
    {
      getNextPageParam: (_, pages) => pages.length,
    },
  );
}

export function useProjectIdMapping(ballot?: Ballot): Record<string, number> {
  const { data } = api.projects.allApproved.useQuery();

  const projectIndices = useMemo(
    () =>
      ballot?.votes.reduce<Record<string, number>>((acc, { projectId }) => {
        const index = data?.findIndex(
          (attestation) =>
            attestation.id.toLowerCase() === projectId.toLowerCase(),
        );
        acc[projectId] = index ?? -1;

        return acc;
      }, {}) ?? {},
    [data, ballot],
  );

  return projectIndices;
}

export function useProjectMetadata(metadataPtr?: string) {
  return useMetadata<Application>(metadataPtr);
}

export function useProjectCount() {
  return api.projects.count.useQuery();
}
