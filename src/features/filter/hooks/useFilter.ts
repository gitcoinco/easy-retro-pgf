import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/router";
import { type Filter } from "../types";
import { useEffect } from "react";
import { config } from "~/config";

type FilterType = "projects" | "lists";

export const initialFilter: Filter = {
  orderBy: "name",
  sortOrder: "asc",
  limit: config.pageSize,
  cursor: 0,
  seed: 0,
  search: null,
};

export const sortLabels = {
  name_asc: "A to Z",
  name_desc: "Z to A",
  time_asc: "Oldest",
  time_desc: "Newest",
};
export type SortType = keyof typeof sortLabels;

export function useFilter(type: FilterType) {
  const client = useQueryClient();

  return useQuery({
    queryKey: ["filter", type],
    queryFn: () =>
      client.getQueryData<Filter>(["filter", type]) ?? initialFilter,
  });
}

export function useSetFilter(type: FilterType) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (filter: Filter) =>
      client.setQueryData<Filter>(["filter", type], (prev = initialFilter) => ({
        ...prev,
        ...filter,
      })),
  });
}

export const toURL = (prev: object, next: object = {}) =>
  new URLSearchParams({ ...prev, ...next } as unknown as Record<
    string,
    string
  >).toString();

export function useUpdateFilterFromRouter(type: FilterType) {
  const router = useRouter();
  const query = router.query as unknown as Filter;
  const { data: filter } = useFilter(type);
  const { mutate: setFilter } = useSetFilter(type);

  // Update URL when user lands on page
  useEffect(() => {
    // Make sure query is not already set
    if (!router.asPath.includes("?")) {
      void router.replace(`${router.asPath}?${toURL(filter!)}`);
    }
  }, []);

  // Update filter when router query changes
  useEffect(() => {
    if (JSON.stringify(filter) !== JSON.stringify(query)) {
      setFilter(query);
    }
  }, [query, setFilter]);
}
