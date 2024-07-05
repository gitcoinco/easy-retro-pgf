import { MetricsLayout } from "~/layouts/MetricsLayout";
import { BallotSidebar } from "~/features/metrics/components/BallotSidebar";
import { api } from "~/utils/api";
import { BallotProvider } from "~/features/ballot/components/BallotProvider";
import { BallotEditor } from "~/features/ballot/components/BallotEditor";
import { RoundTypes } from "~/features/rounds/types";

export default function MetricsBallot() {
  const { data: metrics, isPending } = api.metrics.forRound.useQuery();
  return (
    <BallotProvider>
      <MetricsLayout
        sidebarComponent={<BallotSidebar />}
        title="Ballot"
        eligibilityCheck
      >
        <BallotEditor
          items={metrics}
          isLoading={isPending}
          type={RoundTypes.impact}
        />
      </MetricsLayout>
    </BallotProvider>
  );
}
