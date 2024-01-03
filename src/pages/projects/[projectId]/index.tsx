import { type GetServerSideProps } from "next";

import { Layout } from "~/layouts/DefaultLayout";
import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { ProjectAddToBallot } from "~/features/projects/components/AddToBallot";

export default function ProjectDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);
  const { name } = project.data ?? {};

  return (
    <Layout sidebar="left" title={name} showBallot eligibilityCheck>
      <ProjectDetails
        attestation={project.data}
        action={<ProjectAddToBallot id={projectId} name={name} />}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
