import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchMetadata } from "~/utils/fetchMetadata";

export const metadataRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ metadataPtr: z.string() }))
    .query(async ({ input: { metadataPtr } }) => fetchMetadata(metadataPtr)),
});
