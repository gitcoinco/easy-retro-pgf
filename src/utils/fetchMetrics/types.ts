type OSOMetricProjectMeta = {
  event_source: string;
  display_name: string;
  project_id: string;
  project_name: string;
  project_namespace: string;
  project_source: string;
};
export type OSOMetric = {
  active_contract_count_90_days: number;
  address_count: number;
  address_count_90_days: number;
  days_since_first_transaction: number;

  gas_fees_sum: number;
  gas_fees_sum_6_months: number;
  high_activity_address_count_90_days: number;
  low_activity_address_count_90_days: number;
  medium_activity_address_count_90_days: number;
  multi_project_address_count_90_days: number;
  new_address_count_90_days: number;
  returning_address_count_90_days: number;
  transaction_count: number;
  transaction_count_6_months: number;
};
export type OSOMetrics = (OSOMetric & OSOMetricProjectMeta)[];

type OrderBy = "asc" | "desc";
export type ImpactMetricsQuery = {
  where: {
    project_name: { _in: string[] };
    event_source: { _eq: "BASE" };
  };
  orderBy: { active_contract_count_90_days: OrderBy }[];
  limit: number;
  offset: number;
};

export type MetricProject = {
  id: string;
  amount: number;
  fraction: number;
};

export type MetricWithProjects = {
  id: string;
  name: string;
  description?: string;
  total: number;
  projects: MetricProject[];
};
type MetricBallot = {
  projects: {
    metrics: { id: string; name: string; allocation: number }[];
  }[];
};
