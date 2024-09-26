import type { OSOMetric, OSOMetricsCSV } from "~/types";
import type { BatchedOSOMetricsCSV } from "~/types/metrics";

/**
 * Indexes metrics by project ID for efficient lookup
 * @param {OSOMetricsCSV[]} metricsArray - The metrics array
 * @returns {Record<string, Partial<OSOMetricsCSV>>} An object with project_id as keys and metrics as values
 */
export const indexMetricsByProjectId = (
  metricsArray: OSOMetricsCSV[],
): Record<string, Partial<OSOMetricsCSV>> => {
  if (!metricsArray || metricsArray.length === 0) return {};

  return Object.fromEntries(
    metricsArray.map((metricsItem: OSOMetricsCSV) => {
      const { id, name, ...metrics } = metricsItem;
      return [id, metrics];
    }),
  );
};

/**
 * Indexes metrics by recipient ID for efficient lookup
 * @param {BatchedOSOMetricsCSV[]} metricsArray - The metrics array
 * @returns {Record<string, Partial<BatchedOSOMetricsCSV>>} An object with project_id as keys and metrics as values
 */
export const indexMetricsByRecipientId = (
  metricsArray: BatchedOSOMetricsCSV[],
): Record<
  string,
  {
    metrics: OSOMetric;
    name: string;
    uuids: string[];
    applicationIDs: string[];
  }
> => {
  if (!metricsArray || metricsArray.length === 0) return {};

  const metricsByRecipientId = Object.fromEntries(
    metricsArray.map((metricsItem: BatchedOSOMetricsCSV) => {
      const { recipient, name, uuid_list, application_id_list, ...metrics } =
        metricsItem;
      return [
        recipient,
        {
          metrics,
          name,
          uuids: uuid_list,
          applicationIDs: application_id_list,
        },
      ];
    }),
  );

  return metricsByRecipientId;
};
