import type { BallotV2, Allocation, Round } from "@prisma/client";
import { calculateMetricsBallot } from "~/utils/calculateMetrics";
import type { MetricId, OSOMetric } from "~/types/metrics";
import { fetchImpactMetricsFromCSV } from "~/utils/fetchMetrics/fetchImpactMetricsFromCSV";
import { fetchApprovedApplications } from "../../applications/utils";
import type { AttestationFetcher } from "~/utils/fetchAttestations";

type Ballot = {
  allocations: Allocation[];
} & BallotV2;

export async function fetchMetricsForBallot({
  attestationFetcher,
  ballot,
  round,
}: {
  attestationFetcher: AttestationFetcher;
  ballot: Ballot;
  round: Round;
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

  const approvedApplications = await fetchApprovedApplications({
    attestationFetcher,
    round,
  });

  const approvedProjects = approvedApplications.map(
    (application) => application.name,
  );

  if (approvedProjects.length === 0) {
    return {
      allocations: [],
      projects: [],
    };
  }

  const metricsByProject = await fetchImpactMetricsFromCSV({
    projects: approvedProjects,
    metrics: Object.keys(metricsById) as MetricId[],
  });

  const calculatedMetrics = calculateMetricsBallot(
    metricsByProject,
    metricsById,
  );

  const metricsForBallot = {
    allocations: ballot?.allocations ?? [],
    projects: calculatedMetrics,
  };

  return metricsForBallot;
}
