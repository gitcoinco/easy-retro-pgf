import { type ComponentProps } from "react";
import { type Address } from "viem";

import { Avatar } from "~/components/ui/Avatar";
import { useProfileWithMetadata } from "~/hooks/useProfile";

// TODO: ProfileMetadata
export function ProjectAvatar(
  props: { profileId: Address } & ComponentProps<typeof Avatar>,
) {
  const profile = useProfileWithMetadata(props.profileId);
  const { profileImageUrl } = profile.data ?? {};

  return <Avatar {...props} src={profileImageUrl} />;
}
