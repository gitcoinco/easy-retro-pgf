import { BackgroundImage } from "~/components/ui/BackgroundImage";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { useProfileWithMetadata } from "~/hooks/useProfile";

export function ListBanner({ id = "" }) {
  const { data: project } = useProjectById(id);
  const { data: metadata, isLoading } = useProfileWithMetadata(
    project?.recipient,
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
