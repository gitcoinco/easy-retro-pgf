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
  limit: z.coerce.number().default(3 * 8),
  cursor: z.coerce.number().default(0),
  seed: z.coerce.number().default(0),
  orderBy: z.nativeEnum(OrderBy).default(OrderBy.name),
  sortOrder: z.nativeEnum(SortOrder).default(SortOrder.asc),
  search: z.preprocess(
    (v) => (v === "null" || v === "undefined" ? null : v),
    z.string().nullish(),
  ),
});

export type Filter = z.infer<typeof FilterSchema>;
