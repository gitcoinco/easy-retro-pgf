import { api } from "~/utils/api";

export function useMetadata<T>(metadataPtr?: string) {
  return api.metadata.get.useQuery<T>(
    { metadataPtr: String(metadataPtr) },
    { enabled: Boolean(metadataPtr) },
  );
}
