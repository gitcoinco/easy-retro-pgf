import { type ComponentProps } from "react";

import { Avatar } from "~/components/ui/Avatar";

export function ProjectAvatar({
  avatarUrl,
  ...props
}: { avatarUrl?: string } & ComponentProps<typeof Avatar>) {
  return <Avatar {...props} src={avatarUrl} />;
}
