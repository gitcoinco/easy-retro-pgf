import { type ComponentProps } from "react";

import { Avatar } from "~/components/ui/Avatar";
import { useProfileMetadata } from "~/hooks/useProfile";

export function ProjectAvatar({
  metadataPtr = "",
  ...props
}: { metadataPtr?: string } & ComponentProps<typeof Avatar>) {
  const { data: metadata } = useProfileMetadata(metadataPtr);
  return <Avatar {...props} src={metadata?.profileImageUrl} />;
}
