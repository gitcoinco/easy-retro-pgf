import type { Metadata } from "./types";

export function parseDecodedMetadata(json: string): Metadata {
  const data = JSON.parse(json) as { name: string; value: { value: string } }[];
  const metadata = data.reduce(
    (acc, x) => ({ ...acc, [x.name]: x.value.value }),
    {} as Metadata,
  );
  return {
    ...metadata,
    // type: parseBytes(metadata.type),
    // round: parseBytes(metadata.round),
  };
}
