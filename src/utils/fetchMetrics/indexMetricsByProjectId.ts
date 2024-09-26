import type { OSOMetric, OSOMetricsCSV } from "~/types";
import type { BatchedOSOMetricsCSV, CreatorOSOMetricsCSV, OSOCreatorMetric } from "~/types/metrics";

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
  creatorArray: CreatorOSOMetricsCSV[],
): Record<
  string,
  {
    metrics: OSOMetric | OSOCreatorMetric;
    name: string;
    uuids: string[];
    applicationIDs: string[];
  }
> => {
  if (!metricsArray || metricsArray.length === 0) return {};

  const combinedArray = [...metricsArray, ...creatorArray];

  const metricsByRecipientId = Object.fromEntries(
    combinedArray.map((metricsItem) => {
      const { recipient, name = "", application_id_list, ...metrics } =
        metricsItem;
      return [
        `${recipient}_${name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, "")}`,
        {
          metrics,
          name,
          recipient,
          uuids: [], // TODO remove this if we don't need it ?
          applicationIDs: application_id_list!,
        },
      ];
    }),
  );

  return metricsByRecipientId;
};
