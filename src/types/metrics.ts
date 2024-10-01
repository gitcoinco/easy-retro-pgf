import { Address } from "viem";

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
  active_addresses_180D: number;
  active_addresses_90D: number;
  daily_active_addresses_180D: number;
  daily_active_addresses_90D: number;
  farcaster_users_180D: number;
  farcaster_users_90D: number;
  transactions_180D: number;
  transactions_90D: number;
};

export type OSOCreatorMetric = {
  minting_wallet: Address;
  num_drops: string;
  num_unique_minters: string;
  num_transactions: string;
  usd_value_of_transactions: string;
  num_farcaster_minters: string;
  num_farcaster_transactions: string;

}

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
  name: string;
  id: string;
  category: string;
  chain: string;
  address: Address;
};

export type BatchedOSOMetricCSVProjectMeta = {
  recipient: Address;
  name: string;
  uuid_list: string[];
  application_id_list: string[];
  type: string;
};


export type OSOMetricsCSV = OSOMetricCSVProjectMeta & OSOMetric;
export type BatchedOSOMetricsCSV = BatchedOSOMetricCSVProjectMeta & OSOMetric;
export type CreatorOSOMetricsCSV = Partial<BatchedOSOMetricCSVProjectMeta> & OSOCreatorMetric;
