import { type ComponentProps } from "react";
import { type Address } from "viem";

import { Banner } from "~/components/ui/Banner";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { useProfileWithMetadata } from "~/hooks/useProfile";

export function ProjectBanner({
  profileId,
  ...props
}: { profileId?: Address } & ComponentProps<typeof Banner>) {
  const profile = useProfileWithMetadata(profileId);
  const { profileImageUrl, bannerImageUrl } = profile.data ?? {};

  return (
    <div className="overflow-hidden rounded-3xl">
      <Banner {...props} src={bannerImageUrl} fallbackSrc={profileImageUrl} />
    </div>
  );
}

// The Celo Project Banner is a component that displays the banner image of the round, as the application form does not gather any banner.
export function CeloProjectBanner({ ...props }: ComponentProps<typeof Banner>) {
  const round = useCurrentRound();

  return (
    <div className="overflow-hidden rounded-3xl">
      <Banner
        {...props}
        src={round.data?.bannerImageUrl}
        fallbackSrc={round.data?.bannerImageUrl}
      />
    </div>
  );
}
