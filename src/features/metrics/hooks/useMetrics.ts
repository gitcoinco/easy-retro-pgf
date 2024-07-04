"use client";

import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { MetricId } from "../types";

export function useMetricById(id: string) {
  const query = api.metrics.forProjects.useQuery({ metricIds: [id] });

  return { ...query, data: query.data?.[0] };
}

export function useCurrentMetricId() {
  return useRouter().query.metricId as MetricId;
}

export function useCurrentMetric() {
  const metricId = useCurrentMetricId();

  return useMetricById(metricId);
}

export function useMetrics() {
  return api.metrics.forRound.useQuery();
}
