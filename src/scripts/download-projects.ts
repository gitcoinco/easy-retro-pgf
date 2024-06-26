import "dotenv/config";
import { writeFile } from "fs/promises";
import { config, eas } from "~/config";
import { createDataFilter, fetchAttestations } from "~/utils/fetchAttestations";
import { fetchMetadata } from "~/utils/fetchMetadata";

const filters = [
  createDataFilter("type", "bytes32", "application"),
  createDataFilter("round", "bytes32", "ez-rpgf-filecoin-1"),
];

console.log("exporting...");
async function main() {
  return fetchAttestations([eas.schemas.approval], {
    where: {
      attester: { in: config.admins },
      ...createDataFilter("type", "bytes32", "application"),
    },
  })
    .then((attestations = []) => {
      const approvedIds = attestations
        .map(({ refUID }) => refUID)
        .filter(Boolean);

      return fetchAttestations([eas.schemas.metadata], {
        take: 100000,
        skip: 0,
        where: {
          AND: filters,
        },
      });
    })
    .then((projects) => {
      return Promise.all(
        projects.map(async (project) => ({
          ...project,
          profile: await fetchAttestations([eas.schemas.metadata], {
            take: 1,
            where: {
              recipient: { in: [project.recipient] },
              ...createDataFilter("type", "bytes32", "profile"),
            },
            orderBy: [{ time: "desc" }],
          }).then(([profile]) => fetchMetadata(profile?.metadataPtr!)),
          // .then((profile) => fetchMetadata(profile.metadataPtr)),
          metadata: await fetchMetadata(project.metadataPtr),
        })),
      );
    });
}
/*

Name of hypercert → FIL retroPGF: [project name]
URL of logo image
URL of banner image
Description of projects
Link to project (optional)
Work scope → [project name], funding, FIL retroPGF
Time of work → 2023-10-01 to 2024-03-31
List of contributors → [project name]
Allowlist → table with wallet addresses and units the wallet receives out of 10,000 units

*/
main()
  .then((projects) => {
    const _projects = projects.map((p) => ({
      name: p.metadata.name,
      description: p.metadata.bio,
      websiteUrl: p.metadata.websiteUrl,
      logoImage: p.profile.profileImageUrl,
      bannerImage: p.profile.bannerImageUrl,
      workScope: [p.metadata.name, "funding", "FIL retroPGF"],
      timeOfWork: ["2023-10-01", "2024-03-31"],
      contributors: [p.metadata.name],
      allowList: [],
    }));
    console.log(JSON.stringify(_projects, null, 2));
    // console.log(JSON.stringify(projects, null, 2));
    return writeFile(
      "projects.json",
      JSON.stringify(_projects, null, 2),
      "utf-8",
    );
  })
  .catch(console.log);
