import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/router";
import { type Filter } from "../types";
import { useEffect } from "react";

type FilterType = "projects" | "lists";

export const initialFilter: Partial<Filter> = {
  orderBy: "name",
  sortOrder: "asc",
};

export const sortLabels = {
  name_asc: "A to Z",
  name_desc: "Z to A",
  time_asc: "Oldest",
  time_desc: "Newest",
};
export function useFilter(type: FilterType) {
  const client = useQueryClient();

  return useQuery(
    ["filter", type],
    () => client.getQueryData<Filter>(["filter", type]) ?? initialFilter,
    { cacheTime: Infinity },
  );
}

export function useSetFilter(type: FilterType) {
  const client = useQueryClient();

  return useMutation(async (filter: Filter) =>
    client.setQueryData<Filter>(["filter", type], (prev = initialFilter) => ({
      ...prev,
      ...filter,
    })),
  );
}

export const toURL = (prev: Partial<Filter>, next: Partial<Filter> = {}) =>
  new URLSearchParams({ ...prev, ...next } as unknown as Record<
    string,
    string
  >).toString();

export function useUpdateFilterFromRouter(type: FilterType) {
  const router = useRouter();
  const query = router.query;
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
      console.log("UPDATE FILTER", query);
      setFilter(query);
    }
  }, [query, setFilter]);
}
