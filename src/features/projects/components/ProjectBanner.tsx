import { type ComponentProps } from "react";
import { Banner } from "~/components/ui/Banner";
import { useMetadata } from "~/hooks/useMetadata";

export function ProjectBanner({
  metadataPtr = "",
  ...props
}: { metadataPtr?: string } & ComponentProps<typeof Banner>) {
  const { data: metadata } = useMetadata<{
    bannerImageUrl: string;
    profileImageUrl: string;
  }>(metadataPtr);
  return (
    <div className="overflow-hidden rounded-3xl">
      <Banner
        {...props}
        src={metadata?.bannerImageUrl}
        fallbackSrc={metadata?.profileImageUrl}
      />
    </div>
  );
}
