import { MetricsList } from "~/features/metrics/components/MetricsList";
import { MetricsLayout } from "~/layouts/MetricsLayout";
import { BallotSidebar } from "~/features/metrics/components/BallotSidebar";

export default function MetricsPage() {
  return (
    <MetricsLayout sidebarComponent={<BallotSidebar />} title="Metrics">
      <MetricsList />
    </MetricsLayout>
  );
}
