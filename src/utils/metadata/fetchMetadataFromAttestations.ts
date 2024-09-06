import type { Attestation } from "../fetchAttestations";
import { fetchMetadata } from "../fetchMetadata";

export async function fetchMetadataFromAttestations(
  attestations: Attestation[],
) {
  const metadataByAttestationId: Record<string, unknown> = {};

  await Promise.all(
    attestations.map(async ({ id, metadataPtr }) => {
      if (!metadataPtr) return;
      const metadata = await fetchMetadata(metadataPtr);
      metadataByAttestationId[id] = metadata;
    }),
  );

  return metadataByAttestationId;
}
