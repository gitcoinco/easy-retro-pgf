import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchMetadata } from "~/utils/fetchMetadata";

export const metadataRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ metadataPtr: z.string() }))
    .query(async ({ input: { metadataPtr } }) => fetchMetadata(metadataPtr)),

  getBatch: publicProcedure
  .input(z.object({ metadataPtrs: z.array(z.string()) }))
  .query(async ({ input: {metadataPtrs} }) => Promise.all(metadataPtrs.map(metadataPtr => fetchMetadata(metadataPtr))),
    )
});
