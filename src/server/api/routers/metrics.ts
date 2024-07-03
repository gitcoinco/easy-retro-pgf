import { z } from "zod";

import {
  ballotProcedure,
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
import { calculateMetricsBallot } from "~/utils/calculateMetrics";

export const metricsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input: { ids }, ctx }) => {
      if (!ids.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return Object.fromEntries(
        Object.entries(AvailableMetrics).filter(([id]) => ids.includes(id)),
      );
    }),

  forRound: roundProcedure.query(async ({ ctx }) => {
    return Object.entries(AvailableMetrics)
      .filter(([id]) => ctx.round.metrics.includes(id))
      .map(([id, name]) => ({ id, name }));
  }),

  forBallot: ballotProcedure.query(async ({ ctx }) => {
    try {
      const { ballot } = ctx;

      const metricsById = Object.fromEntries(
        ballot?.allocations.map((v) => [v.id, v.amount]),
      );

      // TODO: Fetch approved projects and convert in a way so it can query OSO
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
        Object.keys(metricsById),
      ).then((projects) => {
        return {
          allocations: ballot?.allocations ?? [],
          projects: calculateMetricsBallot(projects, metricsById),
        };
      });
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: (error as Error).message,
      });
    }
  }),
  forProjects: roundProcedure
    .input(z.object({ metricId: z.string() }))
    .query(async ({ input: { metricId }, ctx }) => {
      try {
        // TODO: Fetch approved projects and convert in a way so it can query OSO
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
        ).then((projects) =>
          mapMetrics(projects, [metricId] as (keyof OSOMetric)[]),
        );
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (error as Error).message,
        });
      }
    }),
});
