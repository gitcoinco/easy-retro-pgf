import { openSourceObserverEndpoint } from "~/config";
import { createCachedFetch } from "./fetch";
import { AvailableMetrics } from "~/features/metrics/types";

const fetch = createCachedFetch({ ttl: 1000 * 60 * 10 });

function createMetricsQuery(metrics: string[]) {
  return `
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
      event_source
      display_name
      project_id
      project_name
      project_namespace
      project_source

      ${metrics.join("\n")}
    }
}
`;
}

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
type Query = {
  where: {
    project_name: { _in: string[] };
    event_source: { _eq: "BASE" };
  };
  orderBy: { active_contract_count_90_days: OrderBy }[];
  limit: number;
  offset: number;
};

export function fetchImpactMetrics(variables: Query, metrics: string[] = []) {
  if (metrics.some((id) => !(id in AvailableMetrics))) {
    throw new Error(
      `One of the metrics provided doesn't exist:\n${metrics.join("\n")}`,
    );
  }
  return fetch<{
    onchain_metrics_by_project_v1: OSOMetrics;
  }>(`${openSourceObserverEndpoint}`, {
    method: "POST",
    body: JSON.stringify({ query: createMetricsQuery(metrics), variables }),
  }).then((r) => {
    if (r.errors) throw new Error(r.errors[0]?.message);

    return r.data?.onchain_metrics_by_project_v1;
  });
}

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

const mockedDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et ligula at dolor bibendum auctor. Fusce eu justo nec nisl suscipit sollicitudin. Aliquam erat volutpat. Mauris quis facilisis purus, non auctor magna. Nulla facilisi. Donec et odio vel nulla ornare viverra. Vivamus at lacus nec urna sodales fermentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras sagittis, nibh in sodales aliquet, libero mi porttitor elit, non pharetra arcu nulla non est. Proin vitae augue dignissim, malesuada enim non, fermentum nisi.";

export function mapMetrics(
  results: OSOMetrics,
  metrics: (keyof OSOMetric)[],
  calcAmount = (amount = 0, metricId = "") => amount,
): MetricWithProjects[] {
  const totals = metrics.map((id) => {
    return results.reduce((sum, item) => sum + item[id], 0);
  });

  return metrics.map((id, i) => {
    const total = totals[i] ?? 0;
    return {
      id,
      name: id in AvailableMetrics ? AvailableMetrics[id] : id,
      total,
      description: mockedDescription, //! TO REMOVE
      projects: results
        .map((item) => {
          const amount = calcAmount(item[id], id);
          return {
            id: item.project_id,
            name: item.project_name,
            // amount,
            amount: total ? (amount / total) * 100 : 0,
            fraction: total ? amount / total : 0,
          };
        })
        .sort((a, b) => b.amount - a.amount),
    };
  });
}
