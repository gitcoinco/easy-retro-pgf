import { type ComponentProps } from "react";
import { type Address } from "viem";

import { Avatar } from "~/components/ui/Avatar";
import { useProfileWithMetadata } from "~/hooks/useProfile";

export function ProjectAvatar({
  profileId,
  time,
  ...props
}: { profileId?: Address; time?: number } & ComponentProps<typeof Avatar>) {
  const profile = useProfileWithMetadata(profileId, time ?? 0);
  const { profileImageUrl } = profile.data ?? {};

  return <Avatar {...props} src={profileImageUrl} />;
}
