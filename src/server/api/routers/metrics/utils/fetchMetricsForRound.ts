import { AvailableMetrics } from "~/types/metrics";
import { metricsList } from "~/utils/osoData";

export async function fetchMetricsForRound({
  roundMetricIds,
}: {
  roundMetricIds: string[];
}): Promise<
  {
    id: string;
    name: string;
    description?: string;
  }[]
> {
  return Object.entries(AvailableMetrics)
    .filter(([id]) => roundMetricIds.includes(id))
    .map(([id, name]) => ({
      id,
      name,
      ...metricsList.find((m) => m.id === id),
    }));
}
