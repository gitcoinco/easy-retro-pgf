import { GetServerSideProps } from "next";
import MetricDetails from "~/features/metrics/components/MetricDetails";
import { MetricsLayout } from "~/layouts/MetricsLayout";
import { MetricDetailsSidebar } from "~/features/metrics/components/MetricDetailsSidebar";

type MetricsDetailPageProps = {
  metricId: string;
};

export default function MetricsDetailPage({
  metricId = "",
}: MetricsDetailPageProps) {
  return (
    <MetricsLayout
      sidebarComponent={<MetricDetailsSidebar metricId={metricId} />}
    >
      <MetricDetails id={metricId} />
    </MetricsLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { metricId },
}) => {
  return { props: { metricId } };
};
