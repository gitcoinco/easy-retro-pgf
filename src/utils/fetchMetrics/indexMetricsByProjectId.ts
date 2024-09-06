import type { OSOMetricsCSV } from "~/types";

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
      const { project_id, project_name, ...metrics } = metricsItem;
      return [project_id, metrics];
    }),
  );
};
