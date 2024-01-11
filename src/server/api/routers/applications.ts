import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createDataFilter, fetchAttestations } from "~/utils/fetchAttestations";
import { config, eas } from "~/config";

export const FilterSchema = z.object({
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
});

export const applicationsRouter = createTRPCRouter({
  approvals: publicProcedure
    .input(z.object({ ids: z.array(z.string()).optional() }))
    .query(async ({ input }) => {
      return fetchAttestations([eas.schemas.approval], {
        where: {
          attester: { in: config.admins },
          refUID: input.ids ? { in: input.ids } : undefined,
          AND: [
            createDataFilter("type", "bytes32", "application"),
            createDataFilter("round", "bytes32", config.roundId),
          ],
        },
      });
    }),
  list: publicProcedure.input(FilterSchema).query(async ({}) => {
    return fetchAttestations([eas.schemas.metadata], {
      orderBy: [{ time: "desc" }],
      where: {
        AND: [
          createDataFilter("type", "bytes32", "application"),
          createDataFilter("round", "bytes32", config.roundId),
        ],
      },
    });
  }),
});
