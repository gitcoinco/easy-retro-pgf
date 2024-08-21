export enum AvailableMetrics {
  active_contract_count_90_days = "Active Contract Count (90 Days)",
  address_count = "Address Count",
  address_count_90_days = "Address Count (90 Days)",
  days_since_first_transaction = "Days Since First Transaction",
  gas_fees_sum = "Gas Fees Sum",
  gas_fees_sum_6_months = "Gas Fees Sum (6 Months)",
  high_activity_address_count_90_days = "High Activity Address Count (90 Days)",
  low_activity_address_count_90_days = "Low Activity Address Count (90 Days)",
  medium_activity_address_count_90_days = "Medium Activity Address Count (90 Days)",
  multi_project_address_count_90_days = "Multi Project Address Count (90 Days)",
  new_address_count_90_days = "New Address Count (90 Days)",
  returning_address_count_90_days = "Returning Address Count (90 Days)",
  transaction_count = "Transaction Count",
  transaction_count_6_months = "Transaction Count (6 Months)",
}

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

export type MetricId = keyof OSOMetric;

export type Metric = {
  id: string;
  name: string;
  description?: string;
};

type OSOMetricProjectMeta = {
  event_source: string;
  display_name: string;
  project_id: string;
  project_name: string;
  project_namespace: string;
  project_source: string;
};

export type OSOMetrics = (OSOMetric & OSOMetricProjectMeta)[];

export type OSOMetricCSVProjectMeta = {
  project_name: string;
};

export type OSOMetricsCSV = OSOMetricCSVProjectMeta & OSOMetric;
