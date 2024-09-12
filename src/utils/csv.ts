import Papa, { type UnparseConfig } from "papaparse";

export function parse<T>(file: string) {
  return Papa.parse<T>(file, { header: true, skipEmptyLines: true });
}
export function format(data: unknown[], config: UnparseConfig) {
  return Papa.unparse(data, config);
}
