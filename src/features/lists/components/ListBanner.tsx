import { BackgroundImage } from "~/components/ui/BackgroundImage";
import { useProfile, useProfileMetadata } from "~/hooks/useProfile";
import { api } from "~/utils/api";

export function ListBanner({ id = "" }) {
  const { data: project } = api.projects.get.useQuery({ approvedId: id });
  const { data: profile } = useProfile(project?.attester);
  const { data: metadata, isLoading } = useProfileMetadata(
    profile?.metadataPtr,
  );
  return (
    <div className="overflow-hidden">
      <BackgroundImage
        isLoading={isLoading}
        className="h-16"
        src={metadata?.bannerImageUrl}
        fallbackSrc={metadata?.profileImageUrl}
      />
    </div>
  );
}
