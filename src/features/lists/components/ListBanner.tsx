import { BackgroundImage } from "~/components/ui/BackgroundImage";
import { useProfileWithMetadata } from "~/hooks/useProfile";
import { api } from "~/utils/api";

export function ListBanner({ id = "" }) {
  const { data: project } = api.projects.get.useQuery({ approvedId: id });
  const { data: metadata, isLoading } = useProfileWithMetadata(
    project?.attester,
  );
  return (
    <div className="overflow-hidden">
      <BackgroundImage
        isLoading={isLoading}
        className="h-16"
        src={metadata?.bannerImageUrl}
        fallbackSrc={metadata?.avatarImageUrl}
      />
    </div>
  );
}
