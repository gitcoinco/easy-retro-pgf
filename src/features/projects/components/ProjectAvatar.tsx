import { type ComponentProps } from "react";

import { Avatar } from "~/components/ui/Avatar";

// TODO: ProfileMetadata
export function ProjectAvatar(
  props: { avatarImageUrl: string; bannerImageUrl: string } & ComponentProps<
    typeof Avatar
  >,
) {
  return <Avatar {...props} src={props.avatarImageUrl} />;
}
