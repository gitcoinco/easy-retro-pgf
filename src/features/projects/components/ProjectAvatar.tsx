import { type ComponentProps } from "react";
import { type Address } from "viem";

import { Avatar } from "~/components/ui/Avatar";
import { useProfileWithMetadata } from "~/hooks/useProfile";

export function ProjectAvatar({
  profileId,
  applicationCreationTime,
  ...props
}: { profileId?: Address; applicationCreationTime?: number } & ComponentProps<
  typeof Avatar
>) {
  const profile = useProfileWithMetadata(
    profileId,
    applicationCreationTime ?? 0,
  );
  const { profileImageUrl } = profile.data ?? {};

  return <Avatar {...props} src={profileImageUrl} />;
}
