import { GetServerSideProps } from "next";
import { api } from "~/utils/api";

export default function MetricsDetailPage({ metricId = "" }) {
  const { data: projects } = api.metrics.forProjects.useQuery({ metricId });
  return (
    <div>
      <p>Metric: {metricId}</p>
      <pre>{JSON.stringify(projects, null, 2)}</pre>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { metricId },
}) => ({ props: { metricId } });
