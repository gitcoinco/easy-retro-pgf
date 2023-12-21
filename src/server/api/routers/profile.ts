import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eas } from "~/config";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type AttestationWithMetadata,
  fetchAttestations,
  parseDecodedJSON,
} from "~/utils/fetchAttestations";

export const profileRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return fetchAttestations([eas.schemas.profileSchema], {
        where: { attester: { equals: input.id } },
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
  const { name: name, profileMetadataPtr: metadataPtr } = parseDecodedJSON<{
    name: string;
    profileMetadataPtr: string;
  }>(decodedDataJson);

  return { id, attester, name, metadataPtr };
}
