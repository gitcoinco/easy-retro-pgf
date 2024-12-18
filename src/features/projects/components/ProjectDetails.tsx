import { type ReactNode } from "react";
import {
  CeloProjectBanner,
  ProjectBanner,
} from "~/features/projects/components/ProjectBanner";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { Heading } from "~/components/ui/Heading";
import ProjectContributions from "./ProjectContributions";
import ProjectImpact from "./ProjectImpact";
import { NameENS } from "~/components/ENS";
import { suffixNumber } from "~/utils/suffixNumber";
import { useProjectMetadata } from "../hooks/useProjects";
import { type Attestation } from "~/utils/fetchAttestations";
import { Markdown } from "~/components/ui/Markdown";
import { useRoundType } from "~/hooks/useRoundType";

export default function ProjectDetails({
  attestation,
  action,
}: {
  action: ReactNode;
  attestation?: Attestation;
}) {
  const metadata = useProjectMetadata(attestation?.metadataPtr);

  const roundType = useRoundType();

  if (roundType === null) {
    return null;
  }
  const isCeloRound = roundType === "CELO";
  const isDripRound = roundType === "DRIP";

  const { bio, websiteUrl, payoutAddress, fundingSources, githubUrl } =
    metadata.data ?? {};

  return (
    <div className="relative mb-24">
      <div className="sticky left-0 right-0 top-0 z-10 bg-white p-4 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{attestation?.name}</h1>
          {action}
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl">
        {isCeloRound ? (
          <CeloProjectBanner size="lg" />
        ) : (
          <ProjectBanner size="lg" profileId={attestation?.recipient} />
        )}
      </div>
      <div className="mb-8 flex items-end gap-4">
        <ProjectAvatar
          rounded="full"
          size={"lg"}
          className="-mt-20 ml-8"
          profileId={attestation?.recipient}
        />
        <div>
          <div className="">
            <NameENS address={payoutAddress} />
            {isDripRound && (
              <div>
                <a href={githubUrl} target="_blank" className="hover:underline">
                  {githubUrl}
                </a>
              </div>
            )}
            {!isCeloRound && (
              <a href={websiteUrl} target="_blank" className="hover:underline">
                {websiteUrl}
              </a>
            )}
          </div>
        </div>
      </div>
      <Markdown>{bio}</Markdown>
      <div>
        <Heading as="h2" size="3xl">
          Impact statements
        </Heading>

        <ProjectContributions
          isLoading={metadata.isPending}
          project={metadata.data}
        />

        <ProjectImpact isLoading={metadata.isPending} project={metadata.data} />
        <Heading as="h3" size="2xl">
          Past grants and funding
        </Heading>
        <div className="space-y-4">
          {fundingSources?.map((source, i) => {
            const type =
              {
                OTHER: "Other",
                RETROPGF_2: "RetroPGF2",
                GOVERNANCE_FUND: "Governance Fund",
                PARTNER_FUND: "Partner Fund",
                REVENUE: "Revenue",
              }[source.type] ?? source.type;
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1 truncate text-xl">
                  {source.description}
                </div>
                <div className="text-sm tracking-widest text-gray-700 dark:text-gray-400">
                  {type}
                </div>
                <div className="w-32 text-xl font-medium">
                  {suffixNumber(source.amount)} {source.currency}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
