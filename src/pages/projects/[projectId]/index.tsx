import { type GetServerSideProps } from "next";

import { Layout } from "~/layouts/DefaultLayout";
import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { ProjectAddToBallot } from "~/features/projects/components/AddToBallot";
import { getAppState } from "~/utils/state";
import { ProjectAwarded } from "~/features/projects/components/ProjectAwarded";

export default function ProjectDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);
  const { name } = project.data ?? {};
  const appState = getAppState();

  const action =
    appState === "RESULTS" ? (
      <ProjectAwarded id={projectId} />
    ) : (
      <ProjectAddToBallot id={projectId} name={name} />
    );
  return (
    <Layout sidebar="left" title={name} showBallot eligibilityCheck>
      <ProjectDetails attestation={project.data} action={action} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
