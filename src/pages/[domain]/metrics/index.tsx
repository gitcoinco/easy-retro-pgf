import { api } from "~/utils/api";
import { MetricsList } from "~/features/metrics/components/MetricsList";
import { MetricsLayout } from "~/layouts/MetricsLayout";
import { BallotSidebar } from "~/features/metrics/components/BallotSidebar";

function useMetricsForRound() {
  return api.metrics.forRound.useQuery();
}

export default function MetricsPage() {
  const { data: metrics, isPending } = useMetricsForRound();

  return (
    <MetricsLayout
      sidebarComponent={<BallotSidebar />}
      title="MetricList"
      showBallot
      eligibilityCheck
    >
      <MetricsList metrics={metrics} isPending={isPending} />
    </MetricsLayout>
  );
}
