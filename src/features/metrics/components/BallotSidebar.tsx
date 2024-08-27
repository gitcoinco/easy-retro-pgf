"use client";

import { api } from "~/utils/api";
import { MetricsSidebar } from "./MetricsSidebar";
import { useIsSavingBallot } from "~/features/ballot/hooks/useBallot";
import { SubmitBallotButton } from "~/features/ballot/components/SubmitBallotButton";
import { useCurrentUser } from "~/hooks/useCurrentUser";
export function BallotSidebar() {
  const { data, error, isPending } = api.metrics.forBallot.useQuery();
  const { isVoter } = useCurrentUser()

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
      {isVoter &&  <SubmitBallotButton />}
    </div>
  );
}
