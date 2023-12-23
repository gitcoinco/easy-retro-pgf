import { Layout } from "~/layouts/DefaultLayout";

import { ProjectCreateForm } from "~/features/projects/components/ProjectCreateForm";
import { Heading } from "~/components/ui/Heading";

export default function NewProjectPage() {
  return (
    <Layout>
      <Heading as="h2" size="2xl">
        New Project
      </Heading>
      <ProjectCreateForm />
    </Layout>
  );
}
