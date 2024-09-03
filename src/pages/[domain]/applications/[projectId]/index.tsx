"use client";

import { type GetServerSideProps } from "next";

import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { ApplicationReviewActions } from "~/features/applications/components/ApplicationReviewActions";
import { Layout } from "~/layouts/DefaultLayout";

export default function ApplicationDetailsPage({ projectId = "" }) {
  const { data: project } = useProjectById(projectId);

  return (
    <Layout title={project?.name}>
      <ProjectDetails
        attestation={project}
        action={<ApplicationReviewActions projectId={projectId} />}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
