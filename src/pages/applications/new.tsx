import { Layout } from "~/layouts/DefaultLayout";

import { ApplicationForm } from "~/features/applications/components/ApplicationForm";
import { Markdown } from "~/components/ui/Markdown";
import { useAccount } from "wagmi";

export default function NewProjectPage() {
  const { address } = useAccount();
  return (
    <Layout eligibilityCheck={false}>
      <Markdown className={"mb-8"}>
        {`
### New Application
Fill out this form to create an application for your project. It will
then be reviewed by our admins. 

Your progress is saved locally so you can return to this page to resume your application.
`}
      </Markdown>
      <ApplicationForm address={address} />
    </Layout>
  );
}
