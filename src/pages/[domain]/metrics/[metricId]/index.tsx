import { GetServerSideProps } from "next";
import { MetricsSidebar } from "~/features/metrics/components/MetricsSidebar";
import MetricDetails from "~/features/metrics/components/MetricDetails";
import { MetricsLayout } from "~/layouts/MetricsLayout";
import { useMetricById } from "~/hooks/useMetrics";
import { Spinner } from "~/components/ui/Spinner";

type MetricsDetailPageProps = {
  metricId: string;
};

export default function MetricsDetailPage({
  metricId = "",
}: MetricsDetailPageProps) {
  const { data, isPending } = useMetricById(metricId);

  const { name = "", description = "", projects = [] } = data ?? {};

  return (
    <MetricsLayout>
      <div className="mx-auto mb-24 flex max-w-screen-lg gap-8 px-4 pb-32 pt-16">
        {isPending ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <Spinner className="mb-4 h-8 w-8" />
              <p className="text-gray-700">Loading metric details...</p>
            </div>
          </div>
        ) : (
          <>
            <section className="flex-1 space-y-6">
              <div className="mb-6 h-5">{"> BREADCRUMBS"}</div>
              <MetricDetails name={name} description={description} />
              <div className="space-y-4">{"COMMENTS"}</div>
              <div className="fixed bottom-10 left-1/2 z-10 -translate-x-1/2 rounded-lg border bg-white p-2 shadow">
                {"PAGINATION"}
              </div>
            </section>
            <aside>
              <MetricsSidebar projects={projects} />
            </aside>
          </>
        )}
      </div>
    </MetricsLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { metricId },
}) => {
  return { props: { metricId } };
};
