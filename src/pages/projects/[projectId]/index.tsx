import { type GetServerSideProps } from "next";
import { useAccount } from "wagmi";

import { LayoutWithBallot } from "~/layouts/DefaultLayout";
import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { ProjectAddToBallot } from "~/features/projects/components/AddToBallot";
import { getAppState } from "~/utils/state";
import { ProjectAwarded } from "~/features/projects/components/ProjectAwarded";
import { Discussion } from "~/features/projects/components/discussion";

export default function ProjectDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);
  const { name } = project.data ?? {};
  const { address } = useAccount();
  const state = getAppState();

  const action =
    state === "RESULTS" ? (
      <ProjectAwarded id={projectId} />
    ) : (
      <ProjectAddToBallot id={projectId} name={name} />
    );
  return (
    <LayoutWithBallot sidebar="left" title={name} showBallot eligibilityCheck>
      <ProjectDetails
        address={address}
        attestation={project.data}
        action={action}
        state={state}
      />
      <Discussion projectId={projectId} state={state} address={address} />
    </LayoutWithBallot>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
