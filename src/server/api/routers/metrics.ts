import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchImpactMetrics } from "~/utils/fetchMetrics";

export const metricsRouter = createTRPCRouter({
  projectMetrics: publicProcedure.input(z.string()).query(async ({ input }) => {
    return fetchImpactMetrics(input);
  }),
});
