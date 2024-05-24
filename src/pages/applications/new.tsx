import { Layout } from "~/layouts/DefaultLayout";

import { ApplicationForm } from "~/features/applications/components/ApplicationForm";
import { Markdown } from "~/components/ui/Markdown";
import { useAccount } from "wagmi";
import { getAppState } from "~/utils/state";
import { Alert } from "~/components/ui/Alert";

export default function NewProjectPage() {
  const { address } = useAccount();
  const state = getAppState();

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
      {state !== "APPLICATION" ? (
        <Alert variant="info" title="Application period has ended"></Alert>
      ) : address ? (
        <ApplicationForm address={address} />
      ) : (
        <Alert variant="info" title="Connect your wallet to continue"></Alert>
      )}
    </Layout>
  );
}
