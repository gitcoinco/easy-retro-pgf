"use client";

import { useMetricById } from "~/features/metrics/hooks/useMetrics";
import { AvailableMetrics } from "~/features/metrics/types";
import { useCurrentMetricId } from "~/features/metrics/hooks/useMetrics";

import { SidebarWithChart } from "./SidebarWithChart";

export function MetricsSidebar() {
  const metricId = useCurrentMetricId();

  const { data, error, isPending } = useMetricById(metricId);

  const projects = data?.projects || [];

  return (
    <SidebarWithChart
      title="Metric Distribution"
      description={AvailableMetrics[metricId]}
      allocationData={projects}
      isPending={isPending}
      error={error}
    />
  );
}
