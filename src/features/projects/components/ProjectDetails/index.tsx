"use client";

import { type ReactNode } from "react";
import { ProjectBanner } from "~/features/projects/components/ProjectBanner";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { Heading } from "~/components/ui/Heading";
import { NameENS } from "~/components/ENS";
import { useProjectMetadata } from "../../hooks/useProjects";
import { type Attestation } from "~/utils/fetchAttestations";
import { Markdown } from "~/components/ui/Markdown";
import { ProfileAvatar } from "../ProfileAvatar";
import { ProfileBanner } from "../ProfileBanner";
import Links from "./Links";
import { Badge } from "~/components/ui/Badge";
import { ImpactStatements } from "./ImpactStatements";
import { FundingSources } from "./FundingSources";
import { AddressBox } from "./AddressBox";

export default function ProjectDetails({
  attestation,
  action,
}: {
  action: ReactNode;
  attestation?: Attestation;
}) {
  const { name, recipient: profileId, metadataPtr } = attestation ?? {};
  const metadata = useProjectMetadata(metadataPtr);

  const isLoading = metadata.isPending;

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

  const {
    avatarUrl,
    coverImageUrl,
    projectType,
    category,
    categoryDetails,
    contracts,
    mintingWalletAddress,
  } = sunnyAwards ?? {};

  console.log(
    JSON.stringify({
      avatarUrl,
      coverImageUrl,
      projectType,
      category,
      categoryDetails,
      contracts,
      mintingWalletAddress,
    }),
  );

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
              <div className="text-red-500">{"Missing payout address"}</div>
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
          <div className="flex flex-col gap-4 font-bold md:flex-row">
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
        {sunnyAwards && !isLoading && (
          <div className="flex flex-col gap-4 md:w-1/3">
            <>
              {mintingWalletAddress && (
                <AddressBox
                  label="Minting wallet address"
                  addresses={[mintingWalletAddress]}
                />
              )}
              {contracts?.length !== undefined &&
                contracts.length > 0 &&
                contracts[0]?.address && (
                  <AddressBox
                    label={`Contract in chain id: ${contracts[0]?.chainId}`}
                    addresses={[contracts[0].address]}
                  />
                )}
            </>
            {contributionLinks && (
              <Links label="Links" links={contributionLinks} showUrl />
            )}
          </div>
        )}
      </div>

      {!sunnyAwards && !isLoading && (
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
          <FundingSources fundingSources={fundingSources} />
        </div>
      )}
    </div>
  );
}
