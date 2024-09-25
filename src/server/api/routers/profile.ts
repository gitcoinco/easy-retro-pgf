import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eas } from "~/config";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchAttestations, createDataFilter } from "~/utils/fetchAttestations";

export const profileRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string(), startsAt: z.number().optional() }))
    .query(async ({ input }) => {
      return fetchAttestations([eas.schemas.metadata], {
        where: {
          recipient: { in: [input.id] },
          ...createDataFilter("type", "bytes32", "profile"),
        },
        orderBy: [{ time: "desc" }],
      },input.startsAt).then(([attestation]) => {
        if (!attestation) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return attestation;
      });
    }),
});
