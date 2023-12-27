import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  fetchAttestations,
  createDataFilter,
  fetchApprovedVoter,
} from "~/utils/fetchAttestations";
import { eas } from "~/config";

export const FilterSchema = z.object({
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
});

export const votersRouter = createTRPCRouter({
  approved: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      return fetchApprovedVoter(input.address);
    }),
  list: publicProcedure.input(FilterSchema).query(async ({}) => {
    return fetchAttestations([eas.schemas.approval], {
      where: {
        ...createDataFilter("type", "bytes32", "voter"),
      },
    });
  }),
});
