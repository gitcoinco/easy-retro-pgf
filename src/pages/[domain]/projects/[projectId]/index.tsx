import { type GetServerSideProps } from "next";

import { LayoutWithBallot } from "~/layouts/DefaultLayout";
import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { ProjectAddToBallot } from "~/features/projects/components/AddToBallot";
import { ProjectAwarded } from "~/features/projects/components/ProjectAwarded";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import { ProjectComments } from "~/features/comments/components/ProjectComments";

export default function ProjectDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);
  const { name } = project.data ?? {};

  const action =
    useRoundState() === "RESULTS" ? (
      <ProjectAwarded id={projectId} />
    ) : (
      <ProjectAddToBallot id={projectId} name={name} />
    );
  return (
    <LayoutWithBallot sidebar="left" title={name} showBallot eligibilityCheck>
      <ProjectDetails attestation={project.data} action={action} />
      <ProjectComments projectId={projectId} />
    </LayoutWithBallot>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
