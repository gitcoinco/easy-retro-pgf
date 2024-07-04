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
import {
  calculateMetricsBallot,
  calculateMetricsForProjects,
} from "~/utils/calculateMetrics";
import { metricsList } from "~/utils/osoData";

// TODO: Fetch approved projects and convert in a way so it can query OSO
const approvedProjects = ["zora", "uniswap", "aave", "gitcoin", "layer3xyz"];
export const metricsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input: { ids }, ctx }) => {
      if (!ids.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return metricsList.filter((metric) => ids.includes(metric.id));
    }),

  forRound: roundProcedure.query(async ({ ctx }) => {
    return Object.entries(AvailableMetrics)
      .filter(([id]) => ctx.round.metrics.includes(id))
      .map(([id, name]) => ({
        id,
        name,
        ...metricsList.find((m) => m.id === id),
      }));
  }),

  forBallot: ballotProcedure.query(async ({ ctx }) => {
    try {
      const { ballot } = ctx;

      const metricsById = Object.fromEntries(
        ballot?.allocations.map((v) => [v.id, v.amount]),
      );

      return fetchImpactMetrics(
        {
          where: {
            project_name: { _in: approvedProjects },
            event_source: { _eq: "BASE" },
          },
          orderBy: [{ active_contract_count_90_days: "desc" }],
          limit: 300,
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
    .input(z.object({ metricIds: z.array(z.string()) }))
    .query(async ({ input: { metricIds }, ctx }) => {
      try {
        return fetchImpactMetrics(
          {
            where: {
              project_name: { _in: approvedProjects },
              event_source: { _eq: "BASE" },
            },
            orderBy: [{ active_contract_count_90_days: "desc" }],
            limit: 300,
            offset: 0,
          },
          metricIds,
        ).then((projects) =>
          mapMetrics(projects, metricIds as (keyof OSOMetric)[]),
        );
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (error as Error).message,
        });
      }
    }),
  projects: roundProcedure
    .input(z.object({ projectIds: z.array(z.string()) }))
    .query(async ({ input: { projectIds }, ctx }) => {
      try {
        const tempProjectMap = Object.fromEntries(
          projectIds.map((id, i) => [
            approvedProjects[i % approvedProjects.length],
            id,
          ]),
        );
        const metricIds = ctx.round.metrics;
        return fetchImpactMetrics(
          {
            where: {
              project_name: { _in: Object.keys(tempProjectMap) },
              event_source: { _eq: "BASE" },
            },
            orderBy: [{ active_contract_count_90_days: "desc" }],
            limit: 300,
            offset: 0,
          },
          metricIds,
        ).then((projects) => {
          return Object.fromEntries(
            projects.map((project) => [
              tempProjectMap[project.project_name],
              metricIds.reduce(
                (acc, x) => ({
                  ...acc,
                  [x]: project[x as keyof typeof project],
                }),
                {},
              ),
            ]),
          );
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (error as Error).message,
        });
      }
    }),
});
