import { type ReactNode } from "react";
import { ProjectBanner } from "~/features/projects/components/ProjectBanner";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { Heading } from "~/components/ui/Heading";
import { NameENS } from "~/components/ENS";
import { suffixNumber } from "~/utils/suffixNumber";
import { useProjectMetadata } from "../../hooks/useProjects";
import { type Attestation } from "~/utils/fetchAttestations";
import { Markdown } from "~/components/ui/Markdown";
import { ProfileAvatar } from "../ProfileAvatar";
import { ProfileBanner } from "../ProfileBanner";
import Links from "./Links";
import { Badge } from "~/components/ui/Badge";
import { ImpactStatements } from "./ImpactStatements";

export default function ProjectDetails({
  attestation,
  action,
}: {
  action: ReactNode;
  attestation?: Attestation;
}) {
  const { name, recipient: profileId, metadataPtr } = attestation ?? {};
  const metadata = useProjectMetadata(metadataPtr);

  const {
    bio,
    websiteUrl,
    payoutAddress,
    fundingSources,
    sunnyAwards,
    contributionDescription,
    contributionLinks,
    impactMetrics,
    impactDescription,
  } = metadata.data ?? {};

  const { avatarUrl, coverImageUrl, projectType, category, categoryDetails } =
    sunnyAwards ?? {};

  return (
    <div className="relative mb-24">
      <div className="sticky left-0 right-0 top-0 z-10 bg-white p-4 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{name}</h1>
          {action}
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl">
        {coverImageUrl ? (
          <ProjectBanner size="lg" bannerImageUrl={coverImageUrl} />
        ) : (
          <ProfileBanner size="lg" profileId={profileId} />
        )}
      </div>
      <div className="mb-8 flex items-end gap-4">
        {avatarUrl ? (
          <ProjectAvatar
            rounded="full"
            size={"lg"}
            className="-mt-20 ml-8"
            avatarUrl={avatarUrl}
          />
        ) : (
          <ProfileAvatar
            rounded="full"
            size={"lg"}
            className="-mt-20 ml-8"
            profileId={profileId}
          />
        )}
        <div>
          <div>
            {sunnyAwards && !payoutAddress ? (
              <div>{"Missing payout address"}</div>
            ) : (
              <NameENS address={payoutAddress} />
            )}
            <a href={websiteUrl} target="_blank" className="hover:underline">
              {websiteUrl}
            </a>
          </div>
        </div>
      </div>
      {sunnyAwards && (
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex gap-4 font-bold">
            {projectType && (
              <div className="flex items-center gap-2">
                {"Project Type:"}
                <Badge size="lg" variant="info">
                  {projectType}
                </Badge>
              </div>
            )}
            {category && (
              <div className="flex items-center gap-2">
                {"Category:"}
                <Badge size="lg" variant="success">
                  {category}
                </Badge>
              </div>
            )}
          </div>
          {categoryDetails && (
            <div className="flex items-center gap-2">
              {"Category details:"}
              <Markdown>{categoryDetails}</Markdown>
            </div>
          )}
        </div>
      )}
      <Heading as="h3" size="2xl">
        Description
      </Heading>
      <div className="mb-4 flex flex-col gap-4 md:flex-row">
        <div className="md:w-2/3">
          <Markdown>{bio}</Markdown>
        </div>
        {sunnyAwards && contributionLinks && (
          <Links label="Links" links={contributionLinks} />
        )}
      </div>
      <div>
        <ImpactStatements
          isLoading={metadata.isPending}
          impactMetrics={{
            description: impactDescription,
            metrics: impactMetrics,
          }}
          contributions={{
            description: contributionDescription,
            links: contributionLinks,
          }}
        />
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
