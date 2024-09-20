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
import { createElement, type ReactNode } from "react";
import { Table, Tbody, Td, Th, Thead, Tr } from "~/components/ui/Table";
import { LinkBox } from "./LinkBox";
import { GlobeIcon, LucideIcon } from "lucide-react";

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

  const hasPreviousApplication =
    applicationVerificationData?.previousApplication?.applied === "YES";

  const hasFundingSources = applicationVerificationData?.fundingSources;

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
        <div className="mt-8 ">
          <div className="rounded-md bg-white p-6 shadow-md">
            <Heading as="h3" size="2xl" className="mb-4">
              About the Project
            </Heading>
            <hr className="mb-8 mt-2" />

            <div className="prose max-w-none">
              <Markdown>{bio}</Markdown>
            </div>
          </div>
        </div>
      )}

      {/* Impact Statements */}
      <div className="mt-8 ">
        <div className="rounded-md bg-white p-6 shadow-md">
          <Heading as="h3" size="2xl" className="mb-4">
            Contributions and Impact
          </Heading>
          <hr className="mb-8 mt-2" />

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

      <div className="mt-8 ">
        <div className="rounded-md bg-white p-6 shadow-md">
          <Heading as="h3" size="2xl" className="mb-4">
            Project Team Composition
          </Heading>
          <hr className="mb-8 mt-2" />

          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <div className="w-2/3">
              {/* teamDescription */}
              {teamDescription && (
                <div className="prose max-w-none">
                  <Markdown>{teamDescription}</Markdown>
                </div>
              )}
            </div>
            <div className="w-1/3 ">
              <LinkBox
                label="Application Tweet"
                links={[
                  {
                    url: twitterPost ?? "",
                  },
                ]}
                renderItem={(link) => {
                  const icon: LucideIcon | undefined = {
                    OTHER: GlobeIcon, 
                  }["OTHER" as keyof typeof icon]; 
                  return (
                    <>
                      {createElement(icon ?? "div", {
                        className: "w-4 h-4 mt-1",
                      })}
                      <div
                        className="flex-1 truncate"
                        title={"Application Tweet"}
                      >
                        {link.url}
                      </div>
                    </>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Section */}
      {isAdmin && !isLoading && applicationVerificationData ? (
        <div className="mt-8 ">
          <div className="rounded-md bg-white p-6 shadow-md">
            <Heading as="h3" size="2xl" className="mb-4">
              Project KYC Information
            </Heading>
            <hr className="mb-8 mt-2" />

            <Table>
              <Thead>
                <Tr>
                  <Th className="w-64"></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td className={"text-sm font-semibold"}>
                    Legal Company/Individual Name
                  </Td>
                  <Td>{applicationVerificationData.name}</Td>
                </Tr>
                <Tr>
                  <Td className={"text-sm font-semibold"}>
                    Point of Contact (POC) Name
                  </Td>
                  <Td>{applicationVerificationData.POCName}</Td>
                </Tr>
                <Tr>
                  <Td className={"text-sm font-semibold"}>Additional POC</Td>
                  <Td>{applicationVerificationData.additionalPOC}</Td>
                </Tr>
                <Tr>
                  <Td className={"text-sm font-semibold"}>Physical address</Td>
                  <Td>{applicationVerificationData.projectPhysicalAddress}</Td>
                </Tr>
                <Tr>
                  <Td className={"text-sm font-semibold"}>Project email</Td>
                  <Td>{applicationVerificationData.projectEmail}</Td>
                </Tr>
              </Tbody>
            </Table>
            <div
              className={`${hasPreviousApplication || hasFundingSources ? "" : "hidden"} space-y-4`}
            >
              {/* Past Grants and Funding */}
              <Heading as="h3" size="2xl" className="mb-4">
                Past Grants and Funding
              </Heading>
              <hr className="mb-8 mt-2" />

              <div className="mb-4 flex flex-col gap-4 md:flex-row">
                <div
                  className={`${hasFundingSources && hasPreviousApplication ? "w-2/3" : hasFundingSources && !hasPreviousApplication ? "w-1/1" : "hidden"}`}
                >
                  <Table className="w-full table-fixed overflow-hidden rounded-md">
                    <Thead>
                      <Tr className="bg-gray-100">
                        <Th className="w-2/3 border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Description
                        </Th>
                        <Th className="w-1/3 border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-600">
                          Funding Amount Range
                        </Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {applicationVerificationData?.fundingSources?.map(
                        (source, i) => (
                          <Tr key={i}>
                            {/* Description Column */}
                            <Td className="w-2/3 overflow-hidden break-words border border-gray-300 px-4 py-4 text-gray-800">
                              <Markdown className="prose max-w-none break-words">
                                {source.description}
                              </Markdown>
                            </Td>

                            {/* Funding Amount Range Column */}
                            <Td className="text-md w-1/3 border border-gray-300 px-4 py-4 text-right font-medium text-gray-800">
                              {
                                fundingAmountTypes[
                                  source.range as keyof typeof fundingAmountTypes
                                ]
                              }
                            </Td>
                          </Tr>
                        ),
                      )}
                    </Tbody>
                  </Table>
                </div>

                <div
                  className={`${hasFundingSources && hasPreviousApplication ? "w-1/3" : !hasFundingSources && hasPreviousApplication ? "w-1/1" : "hidden"}`}
                >
                  <LinkBox
                    label="Previous Filecoin RPGF Application"
                    links={[
                      {
                        url:
                          applicationVerificationData.previousApplication
                            ?.link ?? "",
                      },
                    ]}
                    renderItem={(link) => {
                      const icon: LucideIcon | undefined = {
                        OTHER: GlobeIcon, 
                      }["OTHER" as keyof typeof icon]; 
                      return (
                        <>
                          {createElement(icon ?? "div", {
                            className: "w-4 h-4 mt-1",
                          })}
                          <div
                            className="flex-1 truncate"
                            title={"Previous FIL-RPGF Application"}
                          >
                            {link.url}
                          </div>
                        </>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
