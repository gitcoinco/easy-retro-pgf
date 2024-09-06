import type { Filter } from "~/features/filter/types";
import { formatBytes } from "./bytesUtils";

const typeMaps = {
  bytes32: (v: string) => formatBytes(v),
  string: (v: string) => v,
};

export function createSearchFilter(value: string) {
  const formatter = typeMaps.string;
  return {
    decodedDataJson: {
      contains: `%${formatter(value)}%`,
      mode: "insensitive",
    },
  };
}

export function createDataFilter(
  name: string,
  type: "bytes32" | "string",
  value: string,
) {
  const formatter = typeMaps[type];
  return {
    decodedDataJson: {
      contains: `"name":"${name}","type":"${type}","value":"${formatter(
        value,
      )}`,
    },
  };
}

export function createOrderBy(
  orderBy: Filter["orderBy"],
  sortOrder: Filter["sortOrder"],
) {
  const key = {
    time: "time",
    name: "decodedDataJson",
  }[orderBy];

  return { [key]: sortOrder };
}
