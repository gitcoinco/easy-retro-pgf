import { ApplicationsToApprove } from "~/features/applications/components/ApplicationsToApprove";
import { AdminLayout } from "~/layouts/AdminLayout";

export default function ApplicationsPage() {
  return (
    <AdminLayout title="Review applications">
      <ApplicationsToApprove />
    </AdminLayout>
  );
}
