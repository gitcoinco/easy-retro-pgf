import type { MetricWithProjects } from "~/utils/fetchMetrics/types";
import type { OSOMetricsCSV, OSOMetrics, MetricId } from "~/types/metrics";
import { AvailableMetrics } from "~/types/metrics";
import { mockedDescription } from "./mocks";

export function mapMetrics(
  results: OSOMetrics | OSOMetricsCSV[],
  metrics: MetricId[],
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
            id: item.project_id ?? item.project_name + "_id", //! TO REMOVE
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
