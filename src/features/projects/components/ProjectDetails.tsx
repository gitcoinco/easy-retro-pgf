import { ProjectBanner } from "~/features/projects/components/ProjectBanner";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { Heading } from "~/components/ui/Heading";
import ProjectContributions from "./ProjectContributions";
import ProjectImpact from "./ProjectImpact";
import { NameENS } from "~/components/ENS";
import { useDecryption, useProjectMetadata } from "../hooks/useProjects";
import { type Attestation } from "~/utils/fetchAttestations";
import { Markdown } from "~/components/ui/Markdown";
import {
  fundingAmountTypes,
  type ApplicationVerification,
} from "~/features/applications/types";
import { useIsAdmin } from "~/hooks/useIsAdmin";
import { type ReactNode } from "react";

export default function ProjectDetails({
  attestation,
  action,
}: {
  action: ReactNode;
  attestation?: Attestation;
}) {
  const metadata = useProjectMetadata(attestation?.metadataPtr);
  const isAdmin = useIsAdmin();
  const { decryptedData, isLoading } = useDecryption(
    metadata.data?.encryptedData?.iv ?? "",
    metadata.data?.encryptedData?.data ?? "",
  );
  const applicationVerificationData = decryptedData as
    | ApplicationVerification
    | undefined;
  const {
    bio,
    websiteUrl,
    payoutAddress,
    githubProjectLink,
    teamDescription,
    twitterPost,
  } = metadata.data ?? {};

  return (
    <div className="relative mb-24">
      <div className="sticky left-0 right-0 top-0 z-10 bg-white p-4 dark:bg-gray-900">
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
        <div className="flex flex-col items-center">
          <div className="">
            {payoutAddress && <NameENS address={payoutAddress} />}
            <div>
              <a href={websiteUrl} target="_blank" className="hover:underline">
                website: {websiteUrl}
              </a>
            </div>
            <div>
              {githubProjectLink && (
                <a
                  href={githubProjectLink}
                  target="_blank"
                  className="hover:underline"
                >
                  github: {githubProjectLink}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <div className="mt-8">
          <div className="rounded-md bg-white p-6 shadow-sm">
            <Heading as="h3" size="xl" className="mb-4">
              About the Project
            </Heading>
            <div className="prose max-w-none">
              <Markdown>{bio}</Markdown>
            </div>
          </div>
        </div>
      )}

      {/* Impact Statements */}
      <div className="mt-8">
        <div className="rounded-md bg-white p-6 shadow-sm">
          <Heading as="h3" size="xl" className="mb-4">
            Impact Statements
          </Heading>

          <ProjectContributions
            isLoading={metadata.isPending}
            project={metadata.data}
          />

          <ProjectImpact
            isLoading={metadata.isPending}
            project={metadata.data}
          />
        </div>
      </div>

      {/* teamDescription */}
      {teamDescription && (
        <div className="mt-8">
          <div className="rounded-md bg-white p-6 shadow-sm">
            <Heading as="h3" size="xl" className="mb-4">
              Team Composition
            </Heading>
            <div className="prose max-w-none">
              <Markdown>{teamDescription}</Markdown>
            </div>
          </div>
        </div>
      )}

      {/* twitterPost */}
      {twitterPost && (
        <div className="mt-8">
          <div className="rounded-md bg-white p-6 shadow-sm">
            <Heading as="h3" size="xl" className="mb-4">
              Application Tweet
            </Heading>
            <div>
              <a href={twitterPost} target="_blank" className="hover:underline">
                Tweet: {twitterPost}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Admin Section */}
      {isAdmin && !isLoading && applicationVerificationData ? (
        <div className="mt-8">
          <div className="rounded-md bg-white p-6 shadow-sm">
            <Heading as="h3" size="xl" className="mb-4">
              Project KYC Information
            </Heading>
            <div className="space-y-4">
              <div>
                <span className="mr-2 font-semibold">
                  Legal Company/Individual Name:
                </span>
                {applicationVerificationData.name}
              </div>
              <div>
                <span className="mr-2 font-semibold">
                  Point of Contact (POC) Name:
                </span>
                {applicationVerificationData.POCName}
              </div>
              <div>
                <span className="mr-2 font-semibold">Additional POC:</span>
                {applicationVerificationData.additionalPOC}
              </div>
              <div>
                <span className="mr-2 font-semibold">Physical Address:</span>
                {applicationVerificationData.projectPhysicalAddress}
              </div>
              <div>
                <span className="mr-2 font-semibold">Project Email:</span>
                {applicationVerificationData.projectEmail}
              </div>

              {/* Past Grants and Funding */}
              {(applicationVerificationData.previousApplication?.applied ===
                "YES" ||
                applicationVerificationData.fundingSources) && (
                <>
                  <Heading as="h4" size="lg" className="mb-4 mt-6">
                    Past Grants and Funding
                  </Heading>
                  {applicationVerificationData.previousApplication?.applied ===
                    "YES" && (
                    <div>
                      <span className="mr-2 font-semibold">
                        Previous Filecoin RPGF Application:
                      </span>
                      <a
                        href={
                          applicationVerificationData.previousApplication?.link
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {applicationVerificationData.previousApplication?.link}
                      </a>
                    </div>
                  )}

                  {/* Funding Sources */}
                  {applicationVerificationData?.fundingSources && (
                    <div className="mt-4">
                      <div className="rounded-md bg-white shadow-sm">
                        {/* Table Header */}
                        <div className="flex items-center justify-between rounded-t-md bg-gray-100 p-4">
                          <div className="flex-1 font-semibold">
                            Description
                          </div>
                          <div className="w-48 text-right font-semibold">
                            Funding Amount Range
                          </div>
                        </div>
                        {/* Table Rows */}
                        {applicationVerificationData.fundingSources.map(
                          (source, i) => (
                            <div
                              key={i}
                              className={`flex items-center justify-between p-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                              <div className="flex-1">{source.description}</div>
                              <div className="w-48 text-right text-lg font-medium">
                                {
                                  fundingAmountTypes[
                                    source.range as keyof typeof fundingAmountTypes
                                  ]
                                }
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
