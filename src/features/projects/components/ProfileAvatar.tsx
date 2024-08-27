"use client";

import { type ComponentProps } from "react";
import { type Address } from "viem";

import { Avatar } from "~/components/ui/Avatar";
import { useProfileWithMetadata } from "~/hooks/useProfile";

export function ProfileAvatar({
  profileId,
  ...props
}: { profileId?: Address } & ComponentProps<typeof Avatar>) {
  const profile = useProfileWithMetadata(profileId);
  const { profileImageUrl } = profile.data ?? {};

  return <Avatar {...props} src={profileImageUrl} />;
}
