"use client";

import { api } from "~/utils/api";

export function useMetricById(id: string) {
  const query = api.metrics.forProjects.useQuery({ metricId: id });

  return { ...query, data: query.data?.[0] };
}
