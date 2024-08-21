import { PrismaClient, Round } from "@prisma/client";
import {
  adminProcedure,
  attestationProcedure,
  roundProcedure,
  createTRPCRouter,
  adminAttestationProcedure,
} from "~/server/api/trpc";
import { FilterSchema } from "~/features/filter/types";
import { BallotResults, calculateVotes } from "~/utils/calculateResults";
import { TRPCError } from "@trpc/server";
import { getState } from "~/features/rounds/hooks/useRoundState";
import { RoundTypes } from "~/features/rounds/types";
import { formatUnits } from "viem";
import { z } from "zod";
import { fetchMetadata } from "~/utils/fetchMetadata";
import { fetchImpactMetricsFromCSV } from "~/utils/fetchMetrics";
import { MetricId } from "~/types/metrics";

export const resultsRouter = createTRPCRouter({
  distribution: adminAttestationProcedure
    .input(
      z.object({
        totalTokens: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const votes = await calculateBallotResults(ctx);

      const totalVotes = votes.totalVotes;
      const projectVotes = votes.votes ?? {};
      const projectIds = Object.keys(votes.votes ?? {});

      let totalTokens = 0n;

      try {
        totalTokens = BigInt(input.totalTokens);
      } catch (error) {
        throw new Error("Invalid totalTokens value, can not convert to bigint");
      }

      const metadata = await ctx
        .fetchAttestations(["metadata"], {
          where: { id: { in: projectIds } },
        })
        .then((attestations) =>
          Promise.all(
            attestations.map((attestation) =>
              fetchMetadata(attestation.metadataPtr).then((data) => {
                return { id: attestation.id, ...data };
              }),
            ),
          ),
        )
        .then((projects) =>
          projects.reduce((acc, x) => ({ ...acc, [x.id]: x }), {}),
        );

      const distributions = calculateDistributionsByProject({
        projectIds,
        projectVotes,
        totalTokens,
        totalVotes,
        metadata,
      });

      return { totalVotes, projectIds, distributions, metadata };
    }),
  totalVoters: adminProcedure.query(async ({ ctx }) => {
    const roundId = ctx.round?.id || "";
    const { db } = ctx;
    const ballots = await db.ballot.findMany({
      where: { roundId, publishedAt: { not: null } },
      select: { voterId: true, votes: true },
    });
    return ballots.length;
  }),
  votes: adminProcedure.query(async ({ ctx }) => calculateBallotResults(ctx)),
  results: roundProcedure.query(async ({ ctx }) => {
    const round = await ctx.db.round.findFirst({ where: { id: ctx.round.id } });
    if (!round) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }
    if (getState(round) !== "RESULTS") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Results not available yet",
      });
    }
    return calculateBallotResults(ctx);
  }),

  projects: attestationProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      if (getState(ctx.round) !== "RESULTS") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Results not available yet",
        });
      }
      const { votes } = await calculateBallotResults(ctx);

      const sortedIDs = Object.entries(votes ?? {})
        .sort((a, b) => b[1].allocations - a[1].allocations)
        .map(([id]) => id)
        .slice(
          input.cursor * input.limit,
          input.cursor * input.limit + input.limit,
        );

      return ctx
        .fetchAttestations(["metadata"], {
          where: {
            id: { in: sortedIDs },
          },
        })
        .then((attestations) =>
          // Results aren't returned from EAS in the same order as the `where: { in: sortedIDs }`
          // Sort the attestations based on the sorted array
          attestations.sort(
            (a, b) => sortedIDs.indexOf(a.id) - sortedIDs.indexOf(b.id),
          ),
        );
    }),
});

async function calculateBallotResults({
  db,
  round,
}: {
  db: PrismaClient;
  round: Round;
}) {

  let results;
  switch(round.type) {
    case RoundTypes.impact:
      results = generateImpactPayouts(round, db);
      break;

      case RoundTypes.project:
    default:
      results = generateProjectPayouts(round, db);
  }

  return results;
 
}

function calculateDistributionsByProject({
  projectIds,
  metadata,
  projectVotes,
  totalVotes,
  totalTokens,
}: {
  projectIds: Array<string>;
  metadata: Record<string, { payoutAddress: string; name: string }>;
  projectVotes: BallotResults;
  totalVotes: number;
  totalTokens: bigint;
}) {
  return projectIds
    ?.map((projectId) => ({
      projectId,
      name: metadata[projectId]?.name ?? "",
      payoutAddress: metadata[projectId]?.payoutAddress ?? "",
      amount: projectVotes[projectId]?.allocations ?? 0,
    }))
    .filter((p) => p.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .map((p) => {
      return {
        ...p,
        amount:
          totalTokens > 0n
            ? parseFloat(
                formatUnits(
                  calculatePayout(p.amount, totalVotes, totalTokens),
                  18,
                ),
              )
            : p.amount,
      };
    });
}

function calculatePayout(
  votes: number,
  totalVotes: number,
  totalTokens: bigint,
) {
  return (
    (BigInt(Math.round(votes * 100)) * totalTokens) / BigInt(totalVotes) / 100n
  );
}

async function generateImpactPayouts(round: Round, db: PrismaClient) {

  // Fetch the allocations for the specified round
  const allocations = await db.allocation.findMany({
    where: { roundId: round.id },
    select: { 
      id: true, // impact metric id
      amount: true
    },
  });

  // Group and sum the allocation amounts by impact metric id
  // Example: { "metric1": 100, "metric2": 200, ... }
  const metricAmounts = allocations.reduce((accumulator, allocation) => {
    accumulator[allocation.id] = (accumulator[allocation.id] || 0) + allocation.amount;
    return accumulator;
  }, {} as Record<string, number>);
  

  // Fetch metrics from the CSV
  const projectMetrics = await fetchImpactMetricsFromCSV();

  // Calculate payouts for each project based on impact metrics
  const projectPayouts = projectMetrics.reduce((accumulator, projectMetric) => {
    const { project_name } = projectMetric;

    // Compute the total payout for the project
    let projectTotalPayout = 0;

    for (const [metricId, totalAmount] of Object.entries(metricAmounts)) {
      if (metricId in projectMetric) {
        const metricScore = projectMetric[metricId as MetricId] as number;
        const metricPayout = (totalAmount * metricScore) / 100;
        projectTotalPayout += metricPayout;
      }
    }
    // Store the total payout by project name
    accumulator[project_name] = (accumulator[project_name] || 0) + projectTotalPayout;

    return accumulator;
  }, {} as Record<string, number>);

  // Format the final payout data by project
  const formattedPayouts = Object.entries(projectPayouts).map(([projectName, totalPayout]) => ({
    projectName,
    totalPayout,
  }));

  return formattedPayouts;
}

async function generateProjectPayouts(round: Round, db: PrismaClient) {

  const calculation = {
    calculation: round.calculationType as "average" | "median" | "sum",
    threshold: (round.calculationConfig as { threshold: number })?.threshold,
  };

  // Fetch the ballots
  const ballots = await db.ballotV2.findMany({
    where: { roundId: round.id, publishedAt: { not: null } },
    select: { voterId: true, allocations: true },
  });

  const votes = calculateVotes(ballots, calculation);

  const averageVotes = 0;

  const totalVotes = Math.floor(
    Object.values(votes).reduce((sum, x) => sum + (x.allocations ?? 0), 0),
  );

  const totalVoters = ballots.length;

  return { votes, totalVoters, totalVotes, averageVotes };
}