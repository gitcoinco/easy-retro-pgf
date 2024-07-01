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
import { getBallotForUser } from "./ballot";

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

  forBallot: roundProcedure.query(async ({ ctx }) => {
    try {
      const ballot = await getBallotForUser(ctx);

      // TODO: Rename ballot projectId to a more generic id (for both project and metric)
      // and filter on vote.type === impact
      const metricsById = Object.fromEntries(
        ballot.votes.map((v) => [v.projectId, v.amount]),
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
      ).then((res) =>
        mapMetrics(
          res,
          Object.keys(metricsById) as (keyof OSOMetric)[],
          (amount = 0, metricId) => {
            // Calculate the distribution based on the ballot allocation
            const ballotAmount =
              metricsById[metricId as keyof typeof metricsById] ?? 0;

            return ballotAmount * amount;
          },
        ),
      );
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
        ).then((res) => mapMetrics(res, [metricId] as (keyof OSOMetric)[]));
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (error as Error).message,
        });
      }
    }),
});
