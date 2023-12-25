import { config } from "~/config";
import { useMetadata } from "~/hooks/useMetadata";
import { api } from "~/utils/api";
import { type ListMetadata } from "../types";

export function useListById(id: string) {
  return api.lists.get.useQuery({ id }, { enabled: Boolean(id) });
}
export function useLists() {
  return api.lists.query.useInfiniteQuery(
    { limit: config.pageSize },
    {
      getNextPageParam: (_, pages) => pages.length + 1,
    },
  );
}

export function useListMetadata(metadataPtr?: string) {
  return useMetadata<ListMetadata>(metadataPtr);
}
