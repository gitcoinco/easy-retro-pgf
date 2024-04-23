import { type GetServerSideProps } from "next";

import { useProjectById } from "~/features/projects/hooks/useProjects";
import { ApplicationForm } from "~/features/applications/components/ApplicationForm";
import { Layout } from "~/layouts/DefaultLayout";

export default function ApplicationDetailsEditPage({ projectId = "" }) {
  const project = useProjectById(projectId);
  return (
    <Layout title={project.data?.name}>
      <ApplicationForm
        isEditMode={true}
        projectInfo={project.data}
        address=""
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
