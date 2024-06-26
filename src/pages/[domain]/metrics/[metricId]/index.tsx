import { GetServerSideProps } from "next";
import { MetricsSidebar } from "~/features/metrics/components/MetricsSidebar";
import MetricDetails from "~/features/metrics/components/MetricDetails";
import { MetricsLayout } from "~/layouts/MetricsLayout";
import { useMetricById } from "~/hooks/useMetrics";

export default function MetricsDetailPage({ metricId = "" }) {
  const { data, isPending } = useMetricById(metricId);

  const { name = "", description = "", projects = [] } = data ?? {};
  return (
    <MetricsLayout>
      <div className="mx-auto mb-24 flex max-w-screen-lg gap-8 px-4 pb-32 pt-16">
        {isPending ? (
          <div> Loading...</div>
        ) : (
          <>
            <section className="flex-col">
              <MetricDetails name={name} description={description} />
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
}) => ({ props: { metricId } });
