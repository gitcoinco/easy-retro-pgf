import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  roundProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { fetchImpactMetrics } from "~/utils/openSourceObserver";
import { availableMetrics } from "~/features/metrics/types";

export const metricsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input: { ids }, ctx }) => {
      if (!ids.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return {};
    }),

  forRound: roundProcedure.query(async ({ ctx }) => {
    return Object.entries(availableMetrics)
      .filter(([id]) => ctx.round.metrics.includes(id))
      .map(([id, name]) => ({ id, name }));
  }),

  forProjects: roundProcedure.query(async ({ ctx }) => {
    try {
      const approvedProjects = ["zora", "uniswap", "aave", "gitcoin"];
      return fetchImpactMetrics(
        {
          where: {
            project_name: { _in: approvedProjects },
            event_source: { _eq: "BASE" },
          },
          orderBy: [{ active_contract_count_90_days: "desc" }],
          limit: 10,
          offset: 0,
        },
        ctx.round.metrics,
      );
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: (error as Error).message,
      });
    }
  }),
});
