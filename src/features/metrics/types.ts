import { OSOMetric } from "~/utils/fetchMetrics";

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

export type MetricId = keyof OSOMetric;

export type Metric = {
  id: MetricId;
  name: string;
  description?: string;
};
