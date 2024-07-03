"use client";

import { api } from "~/utils/api";
import { MetricsSidebar } from "./MetricsSidebar";

export function MetricDetailsSidebar({ metricId = "" }) {
  const { data, error, isPending } = api.metrics.forProjects.useQuery(
    { metricId },
    { enabled: !!metricId },
  );

  return (
    <MetricsSidebar
      title="Distribution"
      isLoading={isPending}
      formatAllocation={(v) => v.toFixed(2) + "%"}
      projects={data?.[0]?.projects}
    />
  );
}
