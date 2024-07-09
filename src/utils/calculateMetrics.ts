import { OSOMetric, OSOMetrics } from "./fetchMetrics";

export function calculateMetricsBallot(
  projects: OSOMetrics,
  metricsById: Record<string, number>,
) {
  const metricTotal = Object.fromEntries(
    Object.keys(metricsById).map((metricId) => {
      return [
        metricId,
        projects.reduce(
          (sum, item) => sum + item[metricId as keyof OSOMetric],
          0,
        ),
      ];
    }),
  );

  return projects.map((project) => {
    const metrics = Object.keys(metricsById).map((id, i, arr) => {
      const metricId = id as keyof OSOMetric;
      const amount = (project[metricId] ?? 0) * (metricsById[metricId] ?? 0);
      const total = metricTotal[metricId] ?? 0;
      return {
        id: metricId,
        amount,
        fraction: total ? amount / total : 0,
      };
    });

    const amount = metrics.reduce((sum, x) => sum + x.fraction, 0);
    return {
      id: project.project_id,
      name: project.project_name,
      amount,
      metrics,
    };
  });
}
