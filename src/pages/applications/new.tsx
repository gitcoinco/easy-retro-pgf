import { Layout } from "~/layouts/DefaultLayout";

import { NewApplicationForm } from "~/features/applications/components/NewApplicationForm";
import { Markdown } from "~/components/ui/Markdown";

export default function NewProjectPage() {
  return (
    <Layout>
      <Markdown className={"mb-8"}>
        {`
### New Application
Fill out this form to create an application for your project. It will
then be reviewed by our admins. 

Your progress is saved locally so you can return to this page to resume your application.
`}
      </Markdown>
      <NewApplicationForm />
    </Layout>
  );
}
