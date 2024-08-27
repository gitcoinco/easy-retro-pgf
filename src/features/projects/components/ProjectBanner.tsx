import { type ComponentProps } from "react";
import { Banner } from "~/components/ui/Banner";

export function ProjectBanner({
  bannerImageUrl,
  ...props
}: { bannerImageUrl: string } & ComponentProps<typeof Banner>) {
  return (
    <div className="overflow-hidden rounded-3xl">
      <Banner {...props} src={bannerImageUrl} />
    </div>
  );
}
