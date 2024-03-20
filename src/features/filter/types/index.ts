import z from "zod";

export enum OrderBy {
  name = "name",
  time = "time",
}
export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

export const FilterSchema = z.object({
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
  seed: z.number().default(0),
  orderBy: z.nativeEnum(OrderBy).default(OrderBy.name),
  sortOrder: z.nativeEnum(SortOrder).default(SortOrder.asc),
  search: z.string().default(""),
});
