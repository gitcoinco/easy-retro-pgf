import { type ComponentProps } from "react";
import { Avatar } from "~/components/ui/Avatar";

export function ProjectAvatar(
  props: { profileImageUrl?: string  } & ComponentProps<typeof Avatar>,
) {


  return <Avatar {...props} src={props.profileImageUrl} />;
}
