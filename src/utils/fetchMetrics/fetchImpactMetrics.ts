import { openSourceObserverEndpoint } from "~/config";
import { createCachedFetch } from "../fetch";
import {} from "~/types/metrics";
import type { ImpactMetricsQuery } from "~/utils/fetchMetrics/types";

import { AvailableMetrics, type OSOMetrics } from "~/types/metrics";

const fetch = createCachedFetch({ ttl: 1000 * 60 * 10 });

function createMetricsQuery(metrics: string[]) {
  return `
query Oso_onchainMetricsByProjectV1(
  $where: Oso_OnchainMetricsByProjectV1BoolExp,
  $orderBy: [Oso_OnchainMetricsByProjectV1OrderBy!],
  $limit: Int,
  $offset: Int) {
  oso_onchainMetricsByProjectV1(
      where: $where
      order_by: $orderBy
      limit: $limit
      offset: $offset
    ) {
      eventSource
      displayName
      projectId
      projectName
      projectNamespace
      projectSource

      ${metrics.join("\n")}
    }
}
`;
}

export function fetchImpactMetrics(
  variables: ImpactMetricsQuery,
  metrics: string[] = [],
) {
  if (metrics.some((id) => !(id in AvailableMetrics))) {
    console.warn(
      `One of the metrics provided doesn't exist:\n${metrics.join("\n")}`,
    );
  }
  return fetch<{
    onchain_metrics_by_project_v1: OSOMetrics;
  }>(`${openSourceObserverEndpoint}`, {
    method: "POST",
    body: JSON.stringify({
      query: createMetricsQuery(metrics.filter((id) => id in AvailableMetrics)),
      variables,
    }),
  }).then((r) => {
    if (r.errors)
      throw new Error(`OpenSourceObserver: ${r.errors[0]?.message}`);

    return r.data?.onchain_metrics_by_project_v1;
  });
}
