import { type GetServerSideProps } from "next";

import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import ApproveButton from "~/features/applications/components/ApproveButton";
import { Layout } from "~/layouts/DefaultLayout";

export default function ApplicationDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);

  return (
    <Layout title={project.data?.name}>
      <ProjectDetails
        attestation={project.data}
        action={<ApproveButton projectIds={[projectId]} />}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
