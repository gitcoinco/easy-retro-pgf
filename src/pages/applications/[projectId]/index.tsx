import { type GetServerSideProps } from "next";

import { AdminLayout } from "~/layouts/AdminLayout";
import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import ApproveButton from "~/features/applications/components/ApproveButton";

export default function ApplicationDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);

  return (
    <AdminLayout title={project.data?.name}>
      <ProjectDetails
        attestation={project.data}
        action={<ApproveButton projectIds={[projectId]} />}
      />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
