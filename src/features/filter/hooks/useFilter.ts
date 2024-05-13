import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { OrderBy, SortOrder } from "../types";

export const sortLabels = {
  name_asc: "A to Z",
  name_desc: "Z to A",
  time_asc: "Oldest",
  time_desc: "Newest",
};
export type SortType = keyof typeof sortLabels;

export function useFilter() {
  const [filter, setFilter] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      orderBy: parseAsStringEnum<OrderBy>(Object.values(OrderBy)).withDefault(
        OrderBy.name,
      ),
      sortOrder: parseAsStringEnum<SortOrder>(
        Object.values(SortOrder),
      ).withDefault(SortOrder.asc),
    },
    { history: "replace" },
  );

  return { ...filter, setFilter };
}
