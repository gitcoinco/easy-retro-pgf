import { GetServerSideProps } from "next";
import MetricDetails from "~/features/metrics/components/MetricDetails";
import { MetricsLayout } from "~/layouts/MetricsLayout";
import { useMetricById } from "~/features/metrics/hooks/useMetrics";
import { Spinner } from "~/components/ui/Spinner";
import { MetricsSidebar } from "~/features/metrics/components/MetricsSidebar";

type MetricsDetailPageProps = {
  metricId: string;
};

export default function MetricsDetailPage({
  metricId = "",
}: MetricsDetailPageProps) {
  const { data, isPending } = useMetricById(metricId);

  const { name = "", description = "", projects = [] } = data ?? {};

  return (
    <MetricsLayout sidebarComponent={<MetricsSidebar />}>
      {isPending ? (
        <>
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <Spinner className="mb-4 h-8 w-8" />
              <p className="text-gray-700">Loading metric details...</p>
            </div>
          </div>
        </>
      ) : (
        <MetricDetails name={name} description={description} />
      )}
    </MetricsLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { metricId },
}) => {
  return { props: { metricId } };
};
