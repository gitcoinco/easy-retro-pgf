import clsx from "clsx";
import Link from "next/link";

import { useProfile } from "~/hooks/useProfile";
import { Heading } from "~/components/ui/Heading";
import { useListMetadata, useLists } from "../hooks/useLists";
import { type Attestation } from "~/features/projects/types";
import { Badge } from "~/components/ui/Badge";
import { api } from "~/utils/api";
import { InfiniteLoading } from "~/components/InfiniteLoading";
import { AvatarENS } from "~/components/ENS";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { Skeleton } from "~/components/ui/Skeleton";

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
    listContent = [],
    impactCategory = [],
    impactEvaluationDescription,
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
          <div className="no-scrollbar h-5">
            <div className="mb-2 flex gap-2 overflow-x-auto">
              {impactCategory.map((cat) => (
                <Badge key={cat}>{cat}</Badge>
              ))}
            </div>
          </div>

          <p className="mb-4 mt-4 line-clamp-2 h-12 text-gray-800 dark:text-gray-300">
            <Skeleton isLoading={metadata.isLoading} className="w-full">
              {impactEvaluationDescription}
            </Skeleton>
          </p>
          <div className="ml-1 flex items-center text-gray-700 dark:text-gray-300">
            {listContent
              .slice(0, 4)
              ?.map((p) => (
                <ListProjectAvatar key={p.projectId} id={p.projectId} />
              ))}
            {listContent.length > 5 && (
              <div className="ml-1 text-xs">
                +{listContent?.length - 4} projects
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ListProjectAvatar({ id }: { id?: string }) {
  const project = api.projects.get.useQuery({ approvedId: id });
  const profile = useProfile(project.data?.attester);

  const isLoading = project.isLoading || profile.isLoading;
  return (
    <ProjectAvatar
      rounded="full"
      size="xs"
      isLoading={isLoading}
      className="-ml-1"
      metadataPtr={profile.data?.metadataPtr}
    />
  );
}
