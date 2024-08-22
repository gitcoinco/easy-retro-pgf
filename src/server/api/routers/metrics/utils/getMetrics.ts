import { metricsList } from "~/utils/osoData";

export async function getMetrics({ ids }: { ids: string[] }): Promise<
  {
    id: string;
    name: string;
    description: string;
  }[]
> {
  return metricsList.filter((metric) => ids.includes(metric.id));
}
