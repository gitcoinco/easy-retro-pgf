import { ListBanner } from "~/features/lists/components/ListBanner";
import { useProfile } from "~/hooks/useProfile";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { Heading } from "~/components/ui/Heading";
import { AllocationList } from "~/features/ballot/components/AllocationList";
import { Skeleton } from "~/components/ui/Skeleton";
import { formatNumber } from "~/utils/formatNumber";
import { ListEditDistribution } from "./ListEditDistribution";
import { Markdown } from "~/components/ui/Markdown";
import { useListMetadata } from "../hooks/useLists";
import { Attestation } from "~/utils/fetchAttestations";
import { config } from "~/config";

export default function ListDetails({
  attestation,
}: {
  attestation?: Attestation;
}) {
  const { data: profile } = useProfile(attestation?.recipient);

  const metadata = useListMetadata(attestation?.metadataPtr);

  const {
    listDescription,
    listContent,
    impactEvaluationLink,
    impactCategory,
    impactEvaluationDescription,
  } = metadata.data ?? {};

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
        {(listContent ?? []).slice(0, 5).map((p) => (
          <ListBanner key={p.projectId} id={p.projectId} />
        ))}
      </div>
      <div className="mb-8 flex items-end gap-4">
        <ProjectAvatar
          rounded="full"
          size={"lg"}
          className="-mt-20 ml-8"
          projectId={attestation?.recipient}
        />
      </div>
      <Markdown className="mb-8 w-full">{listDescription}</Markdown>

      <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Skeleton isLoading={metadata.isLoading}>
            <p className="font-bold">{listContent?.length} projects</p>
          </Skeleton>
          <span>·</span>
          <Skeleton className="w-32" isLoading={metadata.isLoading}>
            <p className="font-bold">
              {formatNumber(0)} {config.tokenName} allocated
            </p>
          </Skeleton>
        </div>
        {!metadata.isLoading && (
          <ListEditDistribution
            listName={attestation?.name}
            votes={listContent}
          />
        )}
      </div>

      <div className="max-h-[480px] overflow-y-scroll">
        <AllocationList votes={listContent} />
      </div>
    </div>
  );
}
