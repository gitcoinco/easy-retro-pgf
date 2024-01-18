import { config } from "~/config";
import { useMetadata } from "~/hooks/useMetadata";
import { api } from "~/utils/api";
import { type List } from "../types";

export function useListById(id: string) {
  return api.projects.get.useQuery({ id }, { enabled: Boolean(id) });
}
export function useLists() {
  return api.lists.search.useInfiniteQuery(
    { limit: config.pageSize },
    {
      getNextPageParam: (_, pages) => pages.length,
    },
  );
}

export function useListMetadata(metadataPtr?: string) {
  return useMetadata<List>(metadataPtr);
}
