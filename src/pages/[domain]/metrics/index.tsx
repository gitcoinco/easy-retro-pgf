import { api } from "~/utils/api";

function useMetricsForRound() {
  return api.metrics.forRound.useQuery();
}
export default function MetricsPage() {
  const { data: metrics } = useMetricsForRound();
  return (
    <div>
      <pre>{JSON.stringify(metrics, null, 2)}</pre>
    </div>
  );
}
