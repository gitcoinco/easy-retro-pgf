import { type Address } from "viem";
import { api } from "~/utils/api";
import { useMetadata } from "./useMetadata";

export function useProfile(id?: Address, startsAt?: number) {
  return api.profile.get.useQuery({ id: String(id), startsAt }, { enabled: Boolean(id) });
}

export function useProfileWithMetadata(id?: Address, startsAt?: number) {
  const profile = useProfile(id, startsAt);

  return useMetadata<{ profileImageUrl: string; bannerImageUrl: string }>(
    profile.data?.metadataPtr,
  );
}
