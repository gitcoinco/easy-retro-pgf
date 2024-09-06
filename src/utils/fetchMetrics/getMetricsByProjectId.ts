import type { OSOMetricsCSV } from "~/types";
import {
  fetchImpactMetricsFromCSV,
  type FetchImpactMetricsParams,
} from "./fetchImpactMetricsFromCSV";
import { indexMetricsByProjectId } from "./indexMetricsByProjectId";

/**
 * Fetches impact metrics and indexes them by project ID for efficient lookup
 * @param {FetchImpactMetricsParams} filters - Optional filters for fetching metrics
 * @returns {Promise<Record<string, Partial<OSOMetricsCSV>>>} A promise that resolves to an object with project_id as keys and metrics as values
 */
export const getMetricsByProjectId = async (
  filters?: FetchImpactMetricsParams,
): Promise<Record<string, Partial<OSOMetricsCSV>>> => {
  const metricsArray = await fetchImpactMetricsFromCSV(filters);
  const metricsByProjectId = indexMetricsByProjectId(metricsArray);
  return metricsByProjectId;
};
