import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { api } from "~/utils/api";

export function useApplicationsFilter() {
  return useQueryStates(
    {
      search: parseAsString.withDefault(""),
      take: parseAsInteger.withDefault(10),
      skip: parseAsInteger.withDefault(0),
    },
    { history: "replace" },
  );
}
export function useApplications(filter) {
  return api.applications.list.useQuery(filter);
}
