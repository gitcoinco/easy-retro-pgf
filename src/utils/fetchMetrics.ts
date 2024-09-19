import { OSO } from "~/config";
import { createCachedFetch } from "./fetch";

const fetch = createCachedFetch({ ttl: 1000 * 60 * 10 });

export type ImpactMetrics = {
  projectName: string;
  eventSource: string;
  starCount: number;
  forkCount: number;
  contributorCount: number;
  contributorCount6Months: number;
  newContributorCount6Months: number;
  firstCommitDate: string;
  lastCommitDate: string;
  closedIssueCount6Months: number;
  openedIssueCount6Months: number;
  activeDeveloperCount6Months: number;
  fulltimeDeveloperAverage6Months: number;
};

const ImpactMetricsQuery = `
  query ImpactMetrics($projectName: String!) {
    oso_codeMetricsByProjectV1(where: { projectName: { _eq: $projectName } }) {
      projectName
      eventSource
      starCount
      forkCount
      contributorCount
      contributorCount6Months
      newContributorCount6Months
      firstCommitDate
      lastCommitDate
      closedIssueCount6Months
      openedIssueCount6Months
      activeDeveloperCount6Months
      fulltimeDeveloperAverage6Months
    }
  }
`;

export async function fetchImpactMetrics(projectName: string) {

  const headers = {
    Authorization: `Bearer ${OSO.apiKey}`,
  };
  return fetch<{ oso_codeMetricsByProjectV1: ImpactMetrics[] }>(OSO.url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: ImpactMetricsQuery,
      variables: {
        projectName,
      },
    }),
  }).then((r) => {
    if (!r.data) {
      throw new Error(`No data returned from OSO API: ${JSON.stringify(r)}`);
    }
    return r.data.oso_codeMetricsByProjectV1[0] as ImpactMetrics;
  });
}
