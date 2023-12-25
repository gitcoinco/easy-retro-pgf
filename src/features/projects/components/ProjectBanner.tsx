import { type ComponentProps } from "react";
import { Banner } from "~/components/ui/Banner";

// TODO: ProfileMetadata
export function ProjectBanner(
  props: { avatarImageUrl: string; bannerImageUrl: string } & ComponentProps<
    typeof Banner
  >,
) {
  return (
    <div className="overflow-hidden rounded-3xl">
      <Banner
        {...props}
        src={props.bannerImageUrl}
        fallbackSrc={props.avatarImageUrl}
      />
    </div>
  );
}
