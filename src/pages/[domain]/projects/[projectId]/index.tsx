import { type GetServerSideProps } from "next";
import {
  TwitterShareButton,
} from "~/components/TwitterShareButton";;
import { LayoutWithBallot } from "~/layouts/DefaultLayout";
import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { ProjectAddToBallot } from "~/features/projects/components/AddToBallot";
import { ProjectAwarded } from "~/features/projects/components/ProjectAwarded";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import { ProjectComments } from "~/features/comments/components/ProjectComments";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { metadata } from "~/config";

export default function ProjectDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);
  const { name } = project.data ?? {};
  const domain = useCurrentDomain();

  const action =
    useRoundState() === "RESULTS" ? (
      <ProjectAwarded id={projectId} />
    ) : (
      <ProjectAddToBallot id={projectId} name={name} />
    );
  return (
    <LayoutWithBallot sidebar="right" title={name} showBallot eligibilityCheck>
      <ProjectDetails attestation={project.data} action={action} />
      <ProjectComments projectId={projectId} />
      <div className="space-y-4">
        <TwitterShareButton url={`${metadata.url}/${domain}/projects/${projectId}`} />
      </div>
    </LayoutWithBallot >
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
