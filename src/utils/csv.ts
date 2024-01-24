import Papa, { type UnparseConfig } from "papaparse";

const config = {};

export function parse(file: File) {
  return Papa.parse(file, config);
}
export function unparse(data: unknown[], config: UnparseConfig) {
  return Papa.unparse(data, config);
}
