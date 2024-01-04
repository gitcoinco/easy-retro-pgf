import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchAttestations } from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { eas } from "~/config";

export const FilterSchema = z.object({
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
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
      });
    }),
  query: publicProcedure.input(FilterSchema).query(async ({ input }) => {
    return fetchAttestations([eas.schemas.listsSchema], {
      take: input.limit,
      skip: input.cursor * input.limit,
    });
  }),
});
