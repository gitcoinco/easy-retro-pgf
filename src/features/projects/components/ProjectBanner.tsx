import { type ComponentProps } from "react";
import { type Address } from "viem";

import { Banner } from "~/components/ui/Banner";
import { useProfileWithMetadata } from "~/hooks/useProfile";

export function ProjectBanner({
  profileId,
  ...props
}: { profileId?: Address } & ComponentProps<typeof Banner>) {
  const profile = useProfileWithMetadata(profileId, 0);
  const { profileImageUrl, bannerImageUrl } = profile.data ?? {};

  return (
    <div className="overflow-hidden rounded-3xl">
      <Banner {...props} src={bannerImageUrl} fallbackSrc={profileImageUrl} />
    </div>
  );
}
