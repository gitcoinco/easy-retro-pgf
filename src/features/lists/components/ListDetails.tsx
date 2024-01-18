import Link from "next/link";
import { BookTextIcon, ExternalLinkIcon } from "lucide-react";
import { ListBanner } from "~/features/lists/components/ListBanner";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { Heading } from "~/components/ui/Heading";
import { AllocationList } from "~/features/ballot/components/AllocationList";
import { Skeleton } from "~/components/ui/Skeleton";
import { formatNumber } from "~/utils/formatNumber";
import { ListEditDistribution } from "./ListEditDistribution";
import { Markdown } from "~/components/ui/Markdown";
import { useListMetadata } from "../hooks/useLists";
import { type Attestation } from "~/utils/fetchAttestations";
import { config } from "~/config";
import { Button } from "~/components/ui/Button";

export default function ListDetails({
  attestation,
}: {
  attestation?: Attestation;
}) {
  const metadata = useListMetadata(attestation?.metadataPtr);

  const { description, projects = [], impact = {} } = metadata.data ?? {};

  return (
    <div className="relative">
      <div className="sticky left-0 right-0 top-0 z-10 bg-white p-4 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <Heading as="h1" size="xl">
            {attestation?.name}
          </Heading>
        </div>
      </div>
      <div className="absolute right-2 top-2 z-10"></div>

      <div className="h-80 overflow-hidden rounded-3xl">
        {(projects ?? []).slice(0, 5).map((p) => (
          <ListBanner key={p.projectId} id={p.projectId} />
        ))}
      </div>
      <div className="mb-8 flex items-end gap-4">
        <ProjectAvatar
          rounded="full"
          size={"lg"}
          className="-mt-20 ml-8"
          profileId={attestation?.recipient}
        />
      </div>
      <Markdown className="mb-8 w-full">{description}</Markdown>

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold">Impact Evaluation</h3>
        <Skeleton isLoading={metadata.isLoading}>
          <p className="whitespace-pre-wrap">{impact.description}</p>
        </Skeleton>
        {impact.url && (
          <Button
            as={Link}
            href={impact.url}
            target="_blank"
            className="group flex w-fit items-center gap-2 rounded-full border border-neutral-300 bg-transparent px-4 py-1"
          >
            <BookTextIcon className="h-7 w-7 rounded-full p-1 text-neutral-600 transition-all group-hover:bg-neutral-200" />
            <span>Impact Evaluation</span>
            <ExternalLinkIcon className="text-neutral-600" />
          </Button>
        )}
      </div>

      <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Skeleton isLoading={metadata.isLoading}>
            <p className="font-bold">{projects?.length} projects</p>
          </Skeleton>
          <span>·</span>
          <Skeleton className="w-32" isLoading={metadata.isLoading}>
            <p className="font-bold">
              {formatNumber(0)} {config.tokenName} allocated
            </p>
          </Skeleton>
        </div>
        {!metadata.isLoading && (
          <ListEditDistribution listName={attestation?.name} votes={projects} />
        )}
      </div>

      <div className="max-h-[480px] overflow-y-scroll">
        <AllocationList votes={projects} />
      </div>
    </div>
  );
}
