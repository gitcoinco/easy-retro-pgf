import { MetricsLayout } from "~/layouts/MetricsLayout";
import { BallotSidebar } from "~/features/metrics/components/BallotSidebar";
import { BallotEditor } from "~/features/metrics/BallotEditor";
import { api } from "~/utils/api";
import { BallotProvider } from "~/features/ballot/components/provider";

export default function MetricsBallot() {
  const { data: metrics } = api.metrics.forRound.useQuery();

  return (
    <BallotProvider>
      <MetricsLayout
        sidebarComponent={<BallotSidebar />}
        title="Ballot"
        showBallot
        eligibilityCheck
      >
        <BallotEditor metrics={metrics} />
      </MetricsLayout>
    </BallotProvider>
  );
}
