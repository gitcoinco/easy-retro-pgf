import { z } from "zod";

import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import { createDataFilter } from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { FilterSchema } from "~/features/filter/types";

export const listsRouter = createTRPCRouter({
  get: attestationProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx
        .fetchAttestations(["metadata"], {
          where: { id: { equals: input.id } },
        })
        .then(([attestation]) => {
          if (!attestation) {
            throw new TRPCError({ code: "NOT_FOUND" });
          }
          return attestation;
        });
    }),
  search: attestationProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const filters = [
        createDataFilter("type", "bytes32", "list"),
        createDataFilter("round", "bytes32", String(ctx.round?.id)),
      ];
      if (input.search) {
        filters.push(createDataFilter("name", "string", input.search));
      }

      return ctx.fetchAttestations(["metadata"], {
        take: input.limit,
        skip: input.cursor * input.limit,
        where: {
          AND: filters,
        },
      });
    }),
});
