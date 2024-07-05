"use client";

import { api } from "~/utils/api";
import { MetricsSidebar } from "./MetricsSidebar";
import { useIsSavingBallot } from "~/features/ballot/hooks/useBallot";
import { SubmitBallotButton } from "~/features/ballot/components/SubmitBallotButton";

export function BallotSidebar() {
  const { data, error, isPending } = api.metrics.forBallot.useQuery();

  return (
    <div>
      <MetricsSidebar
        title="Ballot Distribution"
        isLoading={isPending}
        isUpdating={useIsSavingBallot()}
        formatAllocation={(v) => v.toFixed(2) + "%"}
        formatChartTick={(v) => v + "%"}
        projects={data?.projects}
      />
      <SubmitBallotButton />
    </div>
  );
}
