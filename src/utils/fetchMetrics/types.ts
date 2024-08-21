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
