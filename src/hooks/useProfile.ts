import { type Address } from "viem";
import { api } from "~/utils/api";
import { useMetadata } from "./useMetadata";

export function useProfile(id?: Address) {
  return api.profile.get.useQuery({ id: String(id) }, { enabled: Boolean(id) });
}

// TODO: ProfileMetadata
export function useProfileMetadata(metadataPtr?: string) {
  return useMetadata<{ avatarImageUrl: string; bannerImageUrl: string }>(
    metadataPtr,
  );
}

export function useProfileWithMetadata(id?: Address) {
  const profile = useProfile(id);

  console.log("PROFIE", profile.data);
  return useProfileMetadata(profile.data?.metadataPtr);
}
