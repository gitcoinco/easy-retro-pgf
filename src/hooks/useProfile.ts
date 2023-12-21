import { type Address } from "viem";
import { api } from "~/utils/api";
import { useMetadata } from "./useMetadata";

export function useProfile(id?: Address) {
  return api.profile.get.useQuery({ id: String(id) }, { enabled: Boolean(id) });
}

export function useProfileMetadata(metadataPtr?: string) {
  return useMetadata<{ profileImageUrl: string; bannerImageUrl: string }>(
    metadataPtr,
  );
}
