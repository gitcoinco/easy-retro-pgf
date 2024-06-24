import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { fetchImpactMetrics } from "~/utils/openSourceObserver";

export const metricsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input: { ids }, ctx }) => {
      if (!ids.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return {};
    }),

  search: publicProcedure.query(async () => {
    return fetchImpactMetrics({
      where: {
        project_name: { _in: ["zora", "uniswap", "safe-global"] },
      },
      orderBy: [{ active_contract_count_90_days: "desc" }],
      limit: 10,
      offset: 0,
    });
  }),
});
