import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type AttestationWithMetadata,
  fetchAttestations,
  parseDecodedMetadata,
  formatBytes,
} from "~/utils/fetchAttestations";
import { type Attestation } from "~/features/projects/types";
import { eas } from "~/config";

export const FilterSchema = z.object({
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
});

export const applicationsRouter = createTRPCRouter({
  list: publicProcedure.input(FilterSchema).query(async ({ input }) => {
    return fetchAttestations([eas.schemas.metadata], {
      take: input.limit,
      skip: input.cursor * input.limit,
      // where: {
      //   decodedDataJson: {
      //     contains: createDataFilter("type", "bytes32", "application"),
      //     // contains: createDataFilter("round", "bytes32", "open-rpgf-1"),
      //   },
      // },
      // where: { id: { in: approvedIds } },
    }).then((attestations) => attestations.map(parseProject));
  }),
});

function parseProject({
  id,
  attester,
  decodedDataJson,
}: AttestationWithMetadata): Attestation {
  console.log(decodedDataJson);
  return { id, attester, ...parseDecodedMetadata(decodedDataJson) };
}
