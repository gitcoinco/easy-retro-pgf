import { z } from "zod";

import {
  ballotProcedure,
  createTRPCRouter,
  publicProcedure,
  roundProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getMetrics } from "./getMetrics";
import { fetchMetricsForRound } from "./fetchMetricsForRound";
import { fetchMetricsForBallot } from "./fetchMetricsForBallots";
import { fetchMetricsForProjects } from "./fetchMetricsForProjects";
import { getProjects } from "./getProjects";

export const metricsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input: { ids }, ctx }) => {
      if (!ids.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return getMetrics({ ids });
    }),

  forRound: roundProcedure.query(async ({ ctx }) => {
    const {
      round: { metrics: roundMetricIds },
    } = ctx;

    return fetchMetricsForRound({ roundMetricIds });
  }),

  forBallot: ballotProcedure.query(async ({ ctx }) => {
    const { ballot } = ctx;
    try {
      return fetchMetricsForBallot({ ballot });
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
        return fetchMetricsForProjects({ metricIds });
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
        const { metrics: metricIds } = ctx.round;
        return getProjects({ projectIds, metricIds });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (error as Error).message,
        });
      }
    }),
});
