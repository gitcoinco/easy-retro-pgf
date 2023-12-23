import { type GetServerSideProps } from "next";

import { Layout } from "~/layouts/DefaultLayout";
import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";

export default function ProjectDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);

  console.log(project.data, projectId);
  return (
    <Layout sidebar="left" title={project.data?.name}>
      <ProjectDetails attestation={project.data} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
