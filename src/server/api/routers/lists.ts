import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createDataFilter, fetchAttestations } from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { config, eas } from "~/config";
import { FilterSchema } from "~/features/filter/types";

export const listsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return fetchAttestations([eas.schemas.metadata], {
        where: { id: { equals: input.id } },
      }).then(([attestation]) => {
        if (!attestation) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return attestation;
      });
    }),
  search: publicProcedure.input(FilterSchema).query(async ({ input }) => {
    const filters = [
      createDataFilter("type", "bytes32", "list"),
      createDataFilter("round", "bytes32", config.roundId),
    ];
    if (input.search) {
      filters.push(createDataFilter("name", "string", input.search));
    }

    return fetchAttestations([eas.schemas.metadata], {
      take: input.limit,
      skip: input.cursor * input.limit,
      where: {
        AND: filters,
      },
    });
  }),
});
