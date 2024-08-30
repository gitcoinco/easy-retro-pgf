import type { z } from "zod";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { type FilterSchema } from "~/server/api/routers/applications/utils/fetchApplications";
import { api } from "~/utils/api";

export const PAGE_SIZE = 20;
export function useApplicationsFilter() {
  return useQueryStates(
    {
      search: parseAsString.withDefault(""),
      status: parseAsStringEnum(["all", "approved", "pending"]).withDefault(
        "pending",
      ),
      take: parseAsInteger.withDefault(PAGE_SIZE),
      skip: parseAsInteger.withDefault(0),
    },
    { history: "replace" },
  );
}
export function useApplications(filter: z.infer<typeof FilterSchema>) {
  return api.applications.list.useQuery(filter);
}
