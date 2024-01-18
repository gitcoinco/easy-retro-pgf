import { config } from "~/config";
import { useMetadata } from "~/hooks/useMetadata";
import { api } from "~/utils/api";
import { type Application } from "~/features/applications/types";
import { useFilter } from "~/features/filter/hooks/useFilter";
import { type Filter } from "~/features/filter/types";

export function useProjectById(id: string) {
  return api.projects.get.useQuery({ id }, { enabled: Boolean(id) });
}

const seed = 0;
// const seed = Math.random();
export function useProjects(filterOverride?: Partial<Filter>) {
  const { data: filter } = useFilter("projects");
  return api.projects.search.useInfiniteQuery(
    { limit: config.pageSize, seed, ...filter, ...filterOverride },
    {
      getNextPageParam: (_, pages) => pages.length,
    },
  );
}

export function useProjectMetadata(metadataPtr?: string) {
  return useMetadata<Application>(metadataPtr);
}

export function useProjectCount() {
  return api.projects.count.useQuery();
}
