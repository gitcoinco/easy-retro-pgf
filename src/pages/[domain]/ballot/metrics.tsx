import { MetricsLayout } from "~/layouts/MetricsLayout";
import { BallotSidebar } from "~/features/metrics/components/BallotSidebar";
import { BallotEditor } from "~/features/metrics/BallotEditor";
import { api } from "~/utils/api";
import { BallotProvider } from "~/features/ballot/components/provider";
import { Button } from "~/components/ui/Button";
import { LoaderIcon } from "lucide-react";
import { useIsSavingBallot } from "~/features/ballotV2/hooks/useBallot";

export default function MetricsBallot() {
  const { data: metrics, isPending } = api.metrics.forRound.useQuery();
  return (
    <BallotProvider>
      <MetricsLayout
        sidebarComponent={<BallotSidebar />}
        title="Ballot"
        showBallot
        eligibilityCheck
      >
        <BallotEditor isLoading={isPending} metrics={metrics} />

        <div className="flex justify-end py-4">
          <div className="flex items-center gap-4">
            <IsSavingBallot />
            <Button variant="primary">Submit ballot</Button>
          </div>
        </div>
      </MetricsLayout>
    </BallotProvider>
  );
}

function IsSavingBallot() {
  const isSavingBallot = useIsSavingBallot();

  return isSavingBallot ? (
    <span className="flex gap-2">
      <LoaderIcon className={"size-4 animate-spin"} />
      <span className="text-xs">Saving ballot...</span>
    </span>
  ) : null;
}
