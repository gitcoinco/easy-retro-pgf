import z from "zod";

export const SortEnum = z
  .enum(["name", "time" /* "shuffle" */])
  .default("name");
export const SortOrderEnum = z.enum(["asc", "desc"]).default("asc");

export const FilterSchema = z.object({
  limit: z.coerce.number().default(3 * 8),
  cursor: z.coerce.number().default(0),
  seed: z.coerce.number().default(0),
  orderBy: SortEnum,
  sortOrder: SortOrderEnum,
  search: z.preprocess(
    (v) => (v === "null" || v === "undefined" ? null : v),
    z.string().nullish(),
  ),
});

export type Sort = z.infer<typeof SortEnum>;
export type SortOrder = z.infer<typeof SortOrderEnum>;
export type Filter = z.infer<typeof FilterSchema>;
