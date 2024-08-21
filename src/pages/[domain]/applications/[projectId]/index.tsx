import { type GetServerSideProps } from "next";

import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import ApproveRejectButton from "~/features/applications/components/ApproveRejectButton";
import { Layout } from "~/layouts/DefaultLayout";

export default function ApplicationDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);

  return (
    <Layout title={project.data?.name}>
      <ProjectDetails
        attestation={project.data}
        action={<ApproveRejectButton projectIds={[projectId]} />}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
