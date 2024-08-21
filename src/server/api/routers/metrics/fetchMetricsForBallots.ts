import type { BallotV2, Allocation } from "@prisma/client";
import { calculateMetricsBallot } from "~/utils/calculateMetrics";
import type { MetricId, OSOMetric } from "~/types/metrics";
import { mockedApprovedProjects } from "./mocks";
import { fetchImpactMetricsFromCSV } from "~/utils/fetchMetrics/fetchImpactMetricsFromCSV";
import { fetchApprovedApplications } from "../applications/fetchApprovedApplications";
import type { AttestationFetcher } from "~/utils/fetchAttestations";

type Ballot = {
  allocations: Allocation[];
} & BallotV2;

export async function fetchMetricsForBallot({
  admins,
  attestationFetcher,
  ballot,
  roundId,
}: {
  admins: string[];
  attestationFetcher: AttestationFetcher;
  ballot: Ballot;
  roundId: string;
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
    admins,
    roundId,
  });

  // const approvedProjects = mockedApprovedProjects; // For testing

  const approvedProjects = approvedApplications.map(
    (application) => application.name,
  );

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
