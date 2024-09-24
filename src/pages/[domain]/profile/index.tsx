import { Layout } from "~/layouts/DefaultLayout";
import { MyApplications } from "~/features/profile/components/MyApplications";

export default function ProjectsPage() {
  return (
    <Layout sidebar="left" sidebarComponent={<ProfileSidebar />}>
      <MyApplications />
    </Layout>
  );
}

function ProfileSidebar() {
  return (
    <div>
      <h3 className="text-lg font-semibold">Profile</h3>
      <p>See your submitted applications here.</p>
    </div>
  );
}
