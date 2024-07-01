import React from "react";
import { SidebarMetric } from "./SidebarMetric";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { useCurrentMetricId } from "~/features/metrics/hooks/useMetrics";
import { SidebarPlaceholder } from "./SidebarPlaceholder";

export function MetricsSidebar() {
  const domain = useCurrentDomain();
  const metricId = useCurrentMetricId();

  if (metricId) {
    return <SidebarMetric metricId={metricId} />;
  }

  return <SidebarPlaceholder title="">No metric id</SidebarPlaceholder>;
}
