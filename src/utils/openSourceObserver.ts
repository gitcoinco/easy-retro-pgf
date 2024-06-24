import { openSourceObserverEndpoint } from "~/config";
import { createCachedFetch } from "./fetch";

const fetch = createCachedFetch({ ttl: 1000 * 60 * 10 });

const MetricsQuery = `
  query Metrics(
    $where: onchain_metrics_by_project_v1_bool_exp,
    $orderBy: [onchain_metrics_by_project_v1_order_by!],
    $limit: Int,
    $offset: Int) {
    onchain_metrics_by_project_v1(
        where: $where
        order_by: $orderBy
        limit: $limit
        offset: $offset
      ) {
        active_contract_count_90_days
        address_count
        address_count_90_days
        days_since_first_transaction
        display_name
        event_source
        gas_fees_sum
        gas_fees_sum_6_months
        high_activity_address_count_90_days
        low_activity_address_count_90_days
        medium_activity_address_count_90_days
        multi_project_address_count_90_days
        new_address_count_90_days
        project_id
        project_name
        project_namespace
        project_source
        returning_address_count_90_days
        transaction_count
        transaction_count_6_months
      }
  }
`;

type OSOMetric = {
  active_contract_count_90_days: number;
  address_count: number;
  address_count_90_days: number;
  days_since_first_transaction: number;
  display_name: string;
  event_source: string;
  gas_fees_sum: number;
  gas_fees_sum_6_months: number;
  high_activity_address_count_90_days: number;
  low_activity_address_count_90_days: number;
  medium_activity_address_count_90_days: number;
  multi_project_address_count_90_days: number;
  new_address_count_90_days: number;
  project_id: string;
  project_name: string;
  project_namespace: string;
  project_source: string;
  returning_address_count_90_days: number;
  transaction_count: number;
  transaction_count_6_months: number;
};

type OrderBy = "asc" | "desc";
type Query = {
  where: {
    project_name: { _in: string[] };
  };
  orderBy: { active_contract_count_90_days: OrderBy }[];
  limit: number;
  offset: number;
};
export function fetchImpactMetrics(variables: Query) {
  return fetch<{
    onchain_metrics_by_project_v1: OSOMetric[];
  }>(`${openSourceObserverEndpoint}`, {
    method: "POST",
    body: JSON.stringify({ query: MetricsQuery, variables }),
  }).then((r) => {
    if (r.errors) throw new Error(r.errors[0]?.message);

    return r.data?.onchain_metrics_by_project_v1;
  });
}
