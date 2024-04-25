import { type ReactNode } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { ProjectBanner } from "~/features/projects/components/ProjectBanner";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { Heading } from "~/components/ui/Heading";
import ProjectContributions from "./ProjectContributions";
import ProjectImpact from "./ProjectImpact";
// import { NameENS } from "~/components/ENS";
import { suffixNumber } from "~/utils/suffixNumber";
import { getAppState } from "~/utils/state";
import { useProjectMetadata } from "../hooks/useProjects";
import { type Attestation } from "~/utils/fetchAttestations";
import { LinkBox } from "./LinkBox";
import { Button } from "~/components/ui/Button";

export default function ProjectDetails({
  attestation,
  action,
}: {
  action: ReactNode;
  attestation?: Attestation;
}) {
  const metadata = useProjectMetadata(attestation?.metadataPtr);
  const { address } = useAccount();
  const state = getAppState();

  const {
    bio,
    websiteUrl,
    // payoutAddress,
    fundingSources,
  } = metadata.data ?? {};
  return (
    <div className="relative">
      <div className="sticky left-0 right-0 top-0 z-10 bg-white p-4 dark:bg-surfaceContainerLow-dark">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{attestation?.name}</h1>
          {action}
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl">
        <ProjectBanner size="lg" profileId={attestation?.recipient} />
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
            {/* <NameENS address={payoutAddress} /> */}
            <a href={websiteUrl} target="_blank" className="hover:underline">
              {websiteUrl}
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <p className="text-2xl">{bio}</p>
        {address === attestation?.attester && state === "APPLICATION" && (
          <Button
            as={Link}
            href={`/projects/${attestation?.id}/edit`}
            variant="outline"
          >
            Edit submitted project
          </Button>
        )}
      </div>
      <div>
        <Heading as="h2" size="3xl">
          Impact statements
        </Heading>

        <ProjectContributions
          isLoading={metadata.isPending}
          project={metadata.data}
        />

        <ProjectImpact isLoading={metadata.isPending} project={metadata.data} />
        {fundingSources?.length > 0 && (
          <>
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
                    <div className="text-sm tracking-widest text-onSurfaceVariant-dark dark:text-gray-400">
                      {type}
                    </div>
                    <div className="w-32 text-xl font-medium">
                      {suffixNumber(source.amount)} {source.currency}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-10 flex items-baseline justify-between">
          {metadata?.data?.socialMedias.length > 0 && (
            <div className="md:w-1/3">
              <div className=" mb-3 text-lg font-bold text-onSurface-dark">
                Social media links
              </div>
              <LinkBox
                links={metadata?.data?.socialMedias}
                renderItem={(link) => (
                  <div className="flex-1 truncate" title={link.type}>
                    {link.type} Link
                  </div>
                )}
              />
            </div>
          )}
          {attestation?.refUID &&
            attestation?.refUID !==
              "0x0000000000000000000000000000000000000000000000000000000000000000" && (
              <div className="md:w-1/3">
                <div className=" mb-3 text-lg font-bold text-onSurface-dark">
                  Previous edits on this project
                </div>
                <LinkBox
                  links={[{ url: attestation?.refUID }]}
                  renderItem={(link) => (
                    <div className="flex-1 truncate" title={link.url}>
                      {link.url}
                    </div>
                  )}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
