import type { LucideIcon } from "lucide-react";
export type {
  AvailableMetrics,
  OSOMetric,
  MetricId,
  Metric,
  OSOMetrics,
  OSOMetricCSVProjectMeta,
  OSOMetricsCSV,
} from "./metrics";

export type IconType = LucideIcon | React.ComponentType; // To handle both LucideIcon and simple-icons
