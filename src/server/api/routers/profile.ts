import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eas } from "~/config";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type AttestationWithMetadata,
  fetchAttestations,
  parseDecodedMetadata,
  createDataFilter,
} from "~/utils/fetchAttestations";

export const profileRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return fetchAttestations([eas.schemas.metadata], {
        where: {
          attester: { in: [input.id] },
          decodedDataJson: {
            contains: createDataFilter("type", "bytes32", "profile"),
          },
        },
      }).then(([attestation]) => {
        if (!attestation) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return attestation ? parseProfile(attestation) : null;
      });
    }),
});

function parseProfile({
  id,
  attester,
  decodedDataJson,
}: AttestationWithMetadata) {
  return {
    id,
    attester,
    ...parseDecodedMetadata(decodedDataJson),
  };
}
