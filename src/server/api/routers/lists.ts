import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type AttestationWithMetadata,
  fetchAttestations,
  parseDecodedJSON,
} from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { type Attestation } from "~/features/projects/types";
import { eas } from "~/config";

export const SortEnum = z.enum(["shuffle", "name"]).optional();
export const TypeEnum = z
  .enum(["application", "profile", "list", ""])
  .optional();

export const FilterSchema = z.object({
  // search: z.string().optional(),
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
  // seed: z.number().default(0),
  // sort: SortEnum,
  // type: TypeEnum,
});

export const listsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return fetchAttestations([eas.schemas.listsSchema], {
        where: { id: { equals: input.id } },
      }).then(([attestation]) => {
        if (!attestation) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return attestation ? parseList(attestation) : null;
      });
    }),
  query: publicProcedure.input(FilterSchema).query(async ({ input }) => {
    return fetchAttestations([eas.schemas.listsSchema], {
      take: input.limit,
      skip: input.cursor * input.limit,
    }).then((attestations) => attestations.map(parseList));
  }),
});

function parseList({
  id,
  attester,
  decodedDataJson,
}: AttestationWithMetadata): Attestation {
  const { listName: name, listMetadataPtr: metadataPtr } = parseDecodedJSON<{
    listName: string;
    listMetadataPtr: string;
  }>(decodedDataJson);

  return { id, attester, name, metadataPtr };
}
