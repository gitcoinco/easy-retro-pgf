import { api } from "~/utils/api";

export default function MetricsPage() {
  const { data: projects } = api.metrics.forProjects.useQuery();
  return (
    <div>
      <pre>{JSON.stringify(projects, null, 2)}</pre>
    </div>
  );
}
