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
import { createDataFilter } from "~/utils/fetchAttestations";
import { roundAwards } from "~/utils/awards";

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

      let metadata = {};

      if (ctx.round.type === RoundTypes.impact) {

        totalTokens = BigInt(getTotalAmountForImpactRound(ctx.round.id));

        const ORFilters = projectIds.map((projectId) =>
          createDataFilter("uuid", "string", projectId),
        );

        metadata = await ctx
          .fetchAttestations(["metadata"], {
            where: {
              OR: ORFilters,
              AND: [createDataFilter("type", "bytes32", "application")],
            },
          })
          .then((attestations) =>
            Promise.all(
              attestations.map((attestation) =>
                fetchMetadata(attestation.metadataPtr).then((data) => {
                  return { uuid: attestation.uuid, ...data };
                }),
              ),
            ),
          )
          .then((projects) =>
            projects.reduce((acc, x) => ({ ...acc, [x.uuid]: x }), {}),
          );
      } else {

        try {
          totalTokens = BigInt(input.totalTokens);
        } catch (error) {
          throw new Error("Invalid totalTokens value, can not convert to bigint");
        }
          
        metadata = await ctx
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
      }

      const distributions = calculateDistributionsByProject({
        projectIds,
        projectVotes,
        totalTokens,
        totalVotes,
        metadata,
      });

      console.log("distributions", distributions);

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
  switch (round.type) {
    case RoundTypes.impact:
      results = generateImpactPayouts(round, db);
      break;

    case RoundTypes.project:
    default:
      results = generateProjectPayouts(round, db);
  }

  return results;
}

function getTotalAmountForImpactRound(roundId: string) {
  const awards = roundAwards[roundId];
  return awards?.reduce((sum, award) => sum + award.amount, 0) || 0;
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
      amountPercentage: projectVotes[projectId]?.allocationPercentage ?? 0,
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
    (BigInt(Math.round(votes * 100)) * totalTokens) / BigInt(Math.round(totalVotes)) / 100n
  );
}

async function generateImpactPayouts(round: Round, db: PrismaClient) {

  const awards = roundAwards[round.id];
  if (!awards) {
    return {
      votes: {},
      totalVoters: 0,
      totalVotes: 0,
      averageVotes: 0,
    }
  }

  // Fetch the allocations for the specified round
  const allocations = await db.allocation.findMany({
    where: { roundId: round.id },
    select: {
      id: true, // impact metric id
      amount: true,
      voterId: true,
    },
  });
  console.log("allocations", allocations);

  // Group and sum the allocation amounts by impact metric id
  // Example: { "metric1": 100, "metric2": 200, ... }
  const metricAmounts = allocations.reduce(
    (accumulator, allocation) => {
      accumulator[allocation.id] =
        (accumulator[allocation.id] || 0) + allocation.amount;
      return accumulator;
    },
    {} as Record<string, number>,
  );
  console.log("metricAmounts", metricAmounts);

  // Fetch metrics from the CSV
  const projectMetrics = await fetchImpactMetricsFromCSV();
  console.log("projectMetrics", projectMetrics);

  // Used to calculate the total score for each metric across all projects
  const totalMetricScoresFromCSV = Object.keys(metricAmounts).reduce(
    (accumulator, key) => {
      accumulator[key] = 0;
      for (const projectMetric of projectMetrics) {
        if (key in projectMetric) {
          accumulator[key] += projectMetric[key as MetricId] as number;
        }
      }
      return accumulator;
    },
    {} as Record<string, number>,
  );
  console.log("totalMetricScoresFromCSV", totalMetricScoresFromCSV);

  const projectPayouts: Record<string, BallotResults> = {};
  const totalAmountForRound = getTotalAmountForImpactRound(round.id);

  // Iterate over each award
  for (const award of awards) {
    const { metrics, amount, eligibleProjects } = award;
    
    let totalMetricsAmount = 0;
    const awardPayouts: BallotResults = {};

    // Calculate payouts and unique voters for each eligible project
    for (const projectMetric of projectMetrics) {
      const { project_id } = projectMetric;

      if (!eligibleProjects.includes(project_id)) continue;

      // Compute the total payout for the project
      let projectTotalPayout = 0;

      // Calculate payout based on specified metrics for this award
      for (const metricId of metrics) {
        if (metricId in projectMetric) {
          // totalValue is the sum of all scores for this metric across all projects
          const totalValue = totalMetricScoresFromCSV[
            metricId as MetricId
          ] as number;
          const metricScore = projectMetric[metricId as MetricId] as number;

          // Payout for this metric based on its score relative to totalValue
          const metricPayout =
            totalValue > 0
              ? (metricScore * (metricAmounts[metricId] || 0)) / totalValue
              : 0;

          projectTotalPayout += metricPayout;
          totalMetricsAmount += metricPayout;
        }
      }

      // Count unique voters for this project
      const projectAllocations = allocations.filter(
        (allocation) => allocation.id in projectMetric,
      );

      const uniqueVoters = new Set(projectAllocations.map((a) => a.voterId));
      const projectVoters = uniqueVoters.size;

      // Store the results in BallotResults format for this award
      awardPayouts[project_id] = {
        voters: projectVoters,
        allocations: projectTotalPayout, // This will be normalized to poolAmount later
      };
    }

    // Normalize the project allocations to the pool amount for this award
    for (const projectId in awardPayouts) {
      if (awardPayouts[projectId]) {
        awardPayouts[projectId].allocations =
          (awardPayouts[projectId].allocations * amount) /
          totalMetricsAmount;

        awardPayouts[projectId].allocationPercentage =
          (awardPayouts[projectId].allocations * 100) / amount;
      }
    }

    // Store the award payouts
    projectPayouts[award.id] = awardPayouts;
  }

  console.log("projectPayouts by award (after normalized)", projectPayouts);

  // Combine payouts across all awards for each project
  const combinedPayouts: BallotResults = {};

  for (const awardId in projectPayouts) {
    const awardPayouts = projectPayouts[awardId];
    for (const projectId in awardPayouts) {
      if (!awardPayouts[projectId]) continue;

      if (!combinedPayouts[projectId]) {
        combinedPayouts[projectId] = {
          voters: awardPayouts[projectId].voters,
          allocations: awardPayouts[projectId].allocations,
        };
      } else {
        combinedPayouts[projectId].voters += awardPayouts[projectId].voters;
        combinedPayouts[projectId].allocations +=
          awardPayouts[projectId].allocations;
      }

      combinedPayouts[projectId].allocationPercentage = (combinedPayouts[projectId].allocations * 100) / totalAmountForRound;
    }
  }

  console.log("totalAmountForRound", totalAmountForRound);
  console.log("combinedPayouts", combinedPayouts);

  // Compute additional metrics
  const normalizedTotalVotes = Object.values(combinedPayouts).reduce(
    (sum, result) => sum + result.allocations,
    0,
  );
  console.log("normalizedTotalVotes", normalizedTotalVotes);
  
  const totalVoters = Object.values(combinedPayouts).reduce(
    (sum, result) => sum + result.voters,
    0,
  );
  console.log("totalVoters", totalVoters);
  
  const averageVotes = totalVoters > 0 ? normalizedTotalVotes / totalVoters : 0;
  console.log("averageVotes", averageVotes);

  return {
    votes: combinedPayouts,
    totalVoters,
    totalVotes: normalizedTotalVotes,
    averageVotes,
  };
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
