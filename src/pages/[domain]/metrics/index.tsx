import { api } from "~/utils/api";
import { MetricsList } from "~/features/metrics/components/MetricsList";
import { MetricsLayout } from "~/layouts/MetricsLayout";
import { MetricsSidebar } from "~/features/metrics/components/MetricsSidebar";

function useMetricsForRound() {
  return api.metrics.forRound.useQuery();
}

export default function MetricsPage() {
  const { data: metrics, isPending } = useMetricsForRound();

  return (
    <MetricsLayout
      sidebarComponent={<MetricsSidebar />}
      title="MetricList"
      showBallot
      eligibilityCheck
    >
      <MetricsList metrics={metrics} isPending={isPending} />
    </MetricsLayout>
  );
}
