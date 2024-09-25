import { type GetServerSideProps } from "next";

import { LayoutWithBallot } from "~/layouts/DefaultLayout";
import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { ProjectAddToBallot } from "~/features/projects/components/AddToBallot";
import { getAppState } from "~/utils/state";
import { ProjectAwarded } from "~/features/projects/components/ProjectAwarded";
import { ProjectComments } from "~/features/comments/components/ProjectComments";

export default function ProjectDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId, 0);
  const { name } = project.data ?? {};

  const action =
    getAppState() === "RESULTS" ? null : ( //<ProjectAwarded id={projectId} />
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
