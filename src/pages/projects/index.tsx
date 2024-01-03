import { Layout } from "~/layouts/DefaultLayout";
import { Projects } from "~/features/projects/components/Projects";

export default function ProjectsPage() {
  return (
    <Layout sidebar="left" eligibilityCheck showBallot>
      <Projects />
    </Layout>
  );
}
