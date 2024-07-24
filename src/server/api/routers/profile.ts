import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import { fetchProfiles } from "~/utils/fetchAttestations";

export const profileRouter = createTRPCRouter({
  get: attestationProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return fetchProfiles(ctx.round!, [input.id]).then(([attestation]) => {
        if (!attestation) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return attestation;
      });
    }),
});
