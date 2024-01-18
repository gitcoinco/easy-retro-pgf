import clsx from "clsx";
import Link from "next/link";

import { Heading } from "~/components/ui/Heading";
import { useListMetadata, useLists } from "../hooks/useLists";
import { api } from "~/utils/api";
import { InfiniteLoading } from "~/components/InfiniteLoading";
import { AvatarENS } from "~/components/ENS";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { Skeleton } from "~/components/ui/Skeleton";
import { type Attestation } from "~/utils/fetchAttestations";
import { type Address } from "viem";
import { ImpactCategories } from "~/features/projects/components/ImpactCategories";

export function Lists() {
  return (
    <InfiniteLoading
      columns={2}
      {...useLists()}
      renderItem={(item, { isLoading }) => (
        <ListItem key={item.id} isLoading={isLoading} attestation={item} />
      )}
    ></InfiniteLoading>
  );
}

function ListItem({
  attestation,
  isLoading,
}: {
  attestation: Attestation;
  isLoading: boolean;
}) {
  const metadata = useListMetadata(attestation.metadataPtr);

  const {
    projects = [],
    impactCategory = [],
    impact = {},
  } = metadata.data ?? {};

  return (
    <Link
      href={`/lists/${attestation?.id}`}
      className={clsx({ ["animate-pulse"]: isLoading })}
    >
      <div className="rounded-2xl border border-gray-200 hover:border-primary-500 dark:border-gray-700 dark:hover:border-primary-500">
        <div className="p-2">
          <Heading className="truncate" size="md" as="h3">
            {attestation?.name}
          </Heading>
          <div className="mb-2 mt-1 flex text-sm text-gray-700 dark:text-gray-300">
            <AvatarENS address={attestation?.attester} />
          </div>
          <Skeleton isLoading={isLoading} className="w-[100px]">
            <ImpactCategories tags={impactCategory} />
          </Skeleton>

          <p className="mb-4 mt-4 line-clamp-2 h-12 text-gray-800 dark:text-gray-300">
            <Skeleton isLoading={metadata.isLoading} className="w-full">
              {impact.description}
            </Skeleton>
          </p>
          <div className="ml-1 flex items-center text-gray-700 dark:text-gray-300">
            {projects
              .slice(0, 4)
              ?.map((p) => (
                <ListProjectAvatar key={p.projectId} id={p.projectId} />
              ))}
            {projects.length > 5 && (
              <div className="ml-1 text-xs">
                +{projects?.length - 4} projects
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ListProjectAvatar({ id }: { id: string }) {
  const project = api.projects.get.useQuery({ id });

  return (
    <ProjectAvatar
      rounded="full"
      size="xs"
      className="-ml-1"
      profileId={project.data?.attester as Address}
    />
  );
}
