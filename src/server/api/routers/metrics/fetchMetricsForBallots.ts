import type { BallotV2, Allocation } from "@prisma/client";
import { calculateMetricsBallot } from "~/utils/calculateMetrics";
import { type OSOMetric, fetchImpactMetrics } from "~/utils/fetchMetrics";
import type { ImpactMetricsQuery } from "~/utils/fetchMetrics/types";
import { mockedApprovedProjects } from "./mocks";

type Ballot = {
  allocations: Allocation[];
} & BallotV2;

export async function fetchMetricsForBallot({
  ballot,
}: {
  ballot: Ballot;
}): Promise<{
  allocations: Allocation[];
  projects: {
    id: string;
    name: string;
    amount: number;
    metrics: {
      id: keyof OSOMetric;
      amount: number;
      fraction: number;
    }[];
  }[];
}> {
  const metricsById = Object.fromEntries(
    ballot?.allocations.map((v) => [v.id, v.amount]),
  );

  const approvedProjects = mockedApprovedProjects;

  const query: ImpactMetricsQuery = {
    where: {
      project_name: { _in: approvedProjects },
      event_source: { _eq: "BASE" },
    },
    orderBy: [{ active_contract_count_90_days: "desc" }],
    limit: 300,
    offset: 0,
  };

  const projects = await fetchImpactMetrics(query, Object.keys(metricsById));

  const metricsForBallot = {
    allocations: ballot?.allocations ?? [],
    projects: calculateMetricsBallot(projects, metricsById),
  };

  return metricsForBallot;
}
