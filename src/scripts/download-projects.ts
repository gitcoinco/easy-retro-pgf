import "dotenv/config";
import { config, eas } from "~/config";
import { createDataFilter, fetchAttestations } from "~/utils/fetchAttestations";

// UNUSED CODE, asses if we should delete it
console.log(config.roundId, process.env.NEXT_PUBLIC_ROUND_ID);
const filters = [
  createDataFilter("type", "bytes32", "application"),
  createDataFilter("round", "bytes32", "ROUND_ID"),
];

console.log(filters);

async function main() {
  const projects = await fetchAttestations([eas.schemas.approval], {
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
      console.log(projects);
    });
}

main().catch(console.log);
