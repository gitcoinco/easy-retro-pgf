import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createDataFilter, fetchAttestations } from "~/utils/fetchAttestations";
import { config, eas } from "~/config";

export const FilterSchema = z.object({
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
});

export const applicationsRouter = createTRPCRouter({
  approvals: publicProcedure.input(FilterSchema).query(async ({ input }) => {
    return fetchAttestations([eas.schemas.approval], {
      where: {
        attester: { in: config.admins },
        ...createDataFilter("type", "bytes32", "application"),
      },
    });
  }),
  list: publicProcedure.input(FilterSchema).query(async ({}) => {
    const registrationEndsAt = Math.floor(+config.registrationEndsAt / 1000);

    return fetchAttestations([eas.schemas.metadata], {
      orderBy: [{ time: "desc" }],
      where: {
        time: { gte: registrationEndsAt },
        ...createDataFilter("type", "bytes32", "application"),
        // AND: [
        //   createDataFilter("type", "bytes32", "application"),
        //   createDataFilter("round", "bytes32", "open-rpgf"),
        // ],
      },
    });
  }),
});
