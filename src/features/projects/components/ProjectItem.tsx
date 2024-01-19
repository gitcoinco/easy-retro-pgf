import { ProjectAvatar } from "./ProjectAvatar";
import { ProjectBanner } from "./ProjectBanner";
import { Heading } from "~/components/ui/Heading";
import { Skeleton } from "~/components/ui/Skeleton";
import { useProjectMetadata } from "../hooks/useProjects";
import { type Attestation } from "~/utils/fetchAttestations";
import { ImpactCategories } from "./ImpactCategories";
import { formatNumber } from "~/utils/formatNumber";
import { config } from "~/config";

export function ProjectItem({
  attestation,
  isLoading,
}: {
  attestation: Attestation;
  isLoading: boolean;
}) {
  const metadata = useProjectMetadata(attestation?.metadataPtr);

  return (
    <article
      data-testid={`project-${attestation.id}`}
      className="group rounded-2xl border border-gray-200 p-2 hover:border-primary-500 dark:border-gray-700 dark:hover:border-primary-500"
    >
      <div className="opacity-70 transition-opacity group-hover:opacity-100">
        <ProjectBanner profileId={attestation?.recipient} />
        <ProjectAvatar
          rounded="full"
          className="-mt-8 ml-4"
          profileId={attestation?.recipient}
        />
      </div>
      <Heading className="truncate" size="lg" as="h3">
        <Skeleton isLoading={isLoading}>{attestation?.name}</Skeleton>
      </Heading>
      <div className="mb-2">
        <p className="line-clamp-2 h-10 text-sm dark:text-gray-300">
          <Skeleton isLoading={isLoading} className="w-full">
            {metadata.data?.bio}
          </Skeleton>
        </p>
      </div>
      <Skeleton isLoading={isLoading} className="w-[100px]">
        <ImpactCategories tags={metadata.data?.impactCategory} />
      </Skeleton>
    </article>
  );
}

export function ProjectItemAwarded({ amount = 0 }) {
  return (
    <div className="absolute right-2 top-[100px] z-10 -mt-2 rounded bg-gray-900 p-1 text-sm">
      <span className="font-bold">{formatNumber(amount)}</span>{" "}
      {config.tokenName}
    </div>
  );
}
