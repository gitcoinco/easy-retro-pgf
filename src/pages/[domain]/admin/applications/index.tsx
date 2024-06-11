import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";
import { ApplicationsToApprove } from "~/features/applications/components/ApplicationsToApprove";

export default function ApplicationsPage() {
  return (
    <RoundAdminLayout title="Review applications">
      {() => <ApplicationsToApprove />}
    </RoundAdminLayout>
  );
}
