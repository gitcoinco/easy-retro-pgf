import { Layout } from "~/layouts/DefaultLayout";
import { ApplicationsToApprove } from "~/features/applications/components/ApplicationsToApprove";

export default function ApplicationsPage() {
  return (
    <Layout title="Review applications">
      <ApplicationsToApprove />
    </Layout>
  );
}
