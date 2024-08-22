import { z } from "zod";

import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import { fetchProfile } from "./utils";

export const profileRouter = createTRPCRouter({
  get: attestationProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { fetchAttestations: attestationFetcher, round } = ctx;
      const profile = await fetchProfile({
        attestationFetcher,
        round,
        recipients: [input.id],
      });
      return profile;
    }),
});
