import { ApplicationsToApprove } from "~/features/applications/components/ApplicationsToApprove";
import { Layout } from "~/layouts/DefaultLayout";

export default function ApplicationsPage() {
  return (
    <Layout title="Review applications">
      <ApplicationsToApprove />
    </Layout>
  );
}
