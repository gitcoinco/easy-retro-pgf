import { Layout } from "~/layouts/DefaultLayout";

import { ApplicationForm } from "~/features/applications/components/ApplicationForm";
import { Markdown } from "~/components/ui/Markdown";
import { useAccount } from "wagmi";
import { getAppState } from "~/utils/state";
import { Alert } from "~/components/ui/Alert";
import { useProfile } from "~/hooks/useProfile";

export default function NewProjectPage() {
  const { address } = useAccount();
  const state = getAppState();

  const profile = useProfile({ id: address });

  console.log("profile", profile.data);
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
      ) : (
        <ApplicationForm address={address} />
      )}
    </Layout>
  );
}
