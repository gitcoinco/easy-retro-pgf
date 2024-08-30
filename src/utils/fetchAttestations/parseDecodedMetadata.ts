import type { Metadata } from "./types";

export function parseDecodedMetadata(json: string): Metadata {
  if (!json) return { name: "", metadataPtr: "", round: "?", type: "?" };
  try {
    const data = JSON.parse(json) as {
      name: string;
      value: { value: string };
    }[];
    const metadata = data.reduce(
      (acc, x) => ({ ...acc, [x.name]: x.value.value }),
      {} as Metadata,
    );
    return {
      ...metadata,
      // type: parseBytes(metadata.type),
      // round: parseBytes(metadata.round),
    };
  } catch (error) {
    console.log("Failed to parse attestation metadata", error);
    return { name: "", metadataPtr: "", round: "?", type: "?" };
  }
}
