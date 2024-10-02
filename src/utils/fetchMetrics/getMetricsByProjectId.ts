import type { OSOMetricsCSV } from "~/types";
import {
  fetchImpactMetricsFromCSV,
  type FetchImpactMetricsParams,
} from "./fetchImpactMetricsFromCSV";
import {
  indexMetricsByProjectId,
  indexMetricsByRecipientId,
} from "./indexMetricsByProjectId";
import type { OSOCreatorMetric, OSOMetric } from "~/types/metrics";
import { fetchBatchedImpactMetricsFromCSV } from "./fetchBatchedImpactMetricsFromCSV";
import { fetchCreatorImpactMetricsFromCSV } from "./fetchCreatorImpactMetricsFromCSV";

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
/**
 * Fetches impact metrics and indexes them by recipient ID for efficient lookup
 * @param {FetchImpactMetricsParams} filters - Optional filters for fetching metrics
 * @returns {Promise<Record<string, Partial<OSOMetricsCSV>>>} A promise that resolves to an object with project_id as keys and metrics as values
 */
export const getMetricsByRecipientId = async (
  filters?: FetchImpactMetricsParams,
): Promise<
  Record<
    string,
    {
      name: string;
      metrics: OSOMetric | OSOCreatorMetric;
      uuids: string[];
      applicationIDs: string[];
    }
  >
> => {
  
  const metricsArray = await fetchBatchedImpactMetricsFromCSV(filters);
  const creatorArray = await fetchCreatorImpactMetricsFromCSV(filters);

  const metricsByProjectId = indexMetricsByRecipientId(metricsArray, creatorArray);

  return metricsByProjectId;
};


