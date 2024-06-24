import Link from "next/link";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";

function useMetricsForRound() {
  return api.metrics.forRound.useQuery();
}
export default function MetricsPage() {
  const domain = useCurrentDomain();
  const { data: metrics } = useMetricsForRound();

  return (
    <div>
      {metrics?.map((metric) => (
        <Link key={metric.id} href={`/${domain}/metrics/${metric.id}`}>
          <div>{metric.name}</div>
        </Link>
      ))}
    </div>
  );
}
