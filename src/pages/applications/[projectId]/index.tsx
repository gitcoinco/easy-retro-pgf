import { type GetServerSideProps } from "next";

import { Layout } from "~/layouts/DefaultLayout";
import ProjectDetails from "~/features/projects/components/ProjectDetails";
import { useProjectById } from "~/features/projects/hooks/useProjects";
import { Button } from "~/components/ui/Button";

export default function ApplicationDetailsPage({ projectId = "" }) {
  const project = useProjectById(projectId);

  console.log(project.data, projectId);
  return (
    <Layout title={project.data?.name}>
      <ProjectDetails
        attestation={project.data}
        action={
          <Button variant="primary" onClick={() => alert("not implemented")}>
            Approve project
          </Button>
        }
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { projectId },
}) => ({ props: { projectId } });
