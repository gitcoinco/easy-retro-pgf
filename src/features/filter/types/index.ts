import z from "zod";
import { config, filecoinRounds } from "~/config";

export enum OrderBy {
  name = "name",
  time = "time",
}
export enum SortOrder {
  asc = "asc",
  desc = "desc",
  random = "random",
}

export const FilterSchema = z.object({
  limit: z.number().default(config.pageSize),
  cursor: z.number().default(0),
  seed: z.number().default(0),
  orderBy: z.nativeEnum(OrderBy).default(OrderBy.name),
  sortOrder: z.nativeEnum(SortOrder).default(SortOrder.asc),
  search: z.string().default(""),
  // Always default to the current running round
  round: z.string().default("2"),
});

export type Filter = z.infer<typeof FilterSchema>;
