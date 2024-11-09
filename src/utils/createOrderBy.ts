import { type Filter } from "~/features/filter/types";

export const createOrderBy = (
  orderBy: Filter["orderBy"],
  sortOrder: Filter["sortOrder"],
) => {
  const key = {
    time: "time",
    name: "decodedDataJson",
  }[orderBy];

  return { [key]: sortOrder };
};
