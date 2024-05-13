import { type ComponentProps } from "react";

import { Banner } from "~/components/ui/Banner";

export function ProjectBanner(
  props: { bannerImageUrl?: string; profileImageUrl?: string } & ComponentProps<
    typeof Banner
  >,
) {
  return (
    <div className="overflow-hidden rounded-3xl">
      <Banner
        {...props}
        src={props.bannerImageUrl}
        fallbackSrc={props.profileImageUrl}
      />
    </div>
  );
}
