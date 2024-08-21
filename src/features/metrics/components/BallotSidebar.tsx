"use client";

import { api } from "~/utils/api";
import { MetricsSidebar } from "./MetricsSidebar";
import { useIsSavingBallot } from "~/features/ballot/hooks/useBallot";
export function BallotSidebar() {
  const { data, error, isPending } = api.metrics.forBallot.useQuery();

  return (
    <MetricsSidebar
      title="Ballot Distribution"
      isLoading={isPending}
      isUpdating={useIsSavingBallot()}
      formatAllocation={(v) => v.toFixed(2) + "%"}
      formatChartTick={(v) => v + "%"}
      projects={data?.projects}
    />
  );
}
