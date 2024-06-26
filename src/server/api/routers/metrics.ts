import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  roundProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  OSOMetric,
  fetchImpactMetrics,
  mapMetrics,
} from "~/utils/fetchMetrics";
import { AvailableMetrics } from "~/features/metrics/types";

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
    return Object.entries(AvailableMetrics)
      .filter(([id]) => ctx.round.metrics.includes(id))
      .map(([id, name]) => ({ id, name }));
  }),

  forProjects: roundProcedure
    .input(z.object({ metricId: z.string() }))
    .query(async ({ input: { metricId }, ctx }) => {
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
          [metricId],
        ).then((res) => mapMetrics(res, [metricId] as (keyof OSOMetric)[]));
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (error as Error).message,
        });
      }
    }),
});
