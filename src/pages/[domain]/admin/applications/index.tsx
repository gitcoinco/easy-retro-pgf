import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";
import { ApplicationsList } from "~/features/applications/components/ApplicationsList";

export default function ApplicationsPage() {
  return (
    <RoundAdminLayout title="Review applications">
      {() => <ApplicationsList />}
    </RoundAdminLayout>
  );
}
