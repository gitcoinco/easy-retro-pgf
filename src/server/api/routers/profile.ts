import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import { createDataFilter } from "~/utils/fetchAttestations";

export const profileRouter = createTRPCRouter({
  get: attestationProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx
        .fetchAttestations(["metadata"], {
          where: {
            recipient: { in: [input.id] },
            ...createDataFilter("type", "bytes32", "profile"),
          },
          orderBy: [{ time: "desc" }],
        })
        .then(([attestation]) => {
          if (!attestation) {
            throw new TRPCError({ code: "NOT_FOUND" });
          }
          return attestation;
        });
    }),
});
