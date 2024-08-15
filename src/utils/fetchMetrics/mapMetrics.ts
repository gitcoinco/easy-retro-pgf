import { AvailableMetrics } from "~/features/metrics/types";
import type { MetricWithProjects, OSOMetric, OSOMetrics } from "./types";
import { mockedDescription } from "./mocks";

export function mapMetrics(
  results: OSOMetrics,
  metrics: (keyof OSOMetric)[],
  calcAmount = (amount = 0, metricId = "") => amount,
): MetricWithProjects[] {
  const totals = metrics.map((id) => {
    return results.reduce((sum, item) => sum + item[id], 0);
  });

  return metrics.map((id, i) => {
    const total = totals[i] ?? 0;
    return {
      id,
      name: id in AvailableMetrics ? AvailableMetrics[id] : id,
      total,
      description: mockedDescription, //! TO REMOVE
      projects: results
        .map((item) => {
          const amount = calcAmount(item[id], id);
          return {
            id: item.project_id,
            name: item.project_name,
            // amount,
            amount: total ? (amount / total) * 100 : 0,
            fraction: total ? amount / total : 0,
          };
        })
        .sort((a, b) => b.amount - a.amount),
    };
  });
}
