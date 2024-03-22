import { Layout } from "~/layouts/DefaultLayout";

import { ApplicationForm } from "~/features/applications/components/ApplicationForm";
import { Markdown } from "~/components/ui/Markdown";
import { useAccount } from "wagmi";
import { getAppState } from "~/utils/state";
import { Alert } from "~/components/ui/Alert";
import { FormSection } from "~/components/ui/Form";

export default function NewProjectPage() {
  const { address } = useAccount();
  const state = getAppState();

  return (
    <Layout>
      <FormSection
        title="New application"
        description={
          <>
            <p>
              Fill out this form to create an application for your project. It
              will then be reviewed by our admins.
            </p>
            <p>
              Your progress is saved locally so you can return to this page to
              resume your application.
            </p>
          </>
        }
      >
        {state !== "APPLICATION" ? (
          <Alert variant="info" title="Application period has ended"></Alert>
        ) : (
          <ApplicationForm address={address} />
        )}
      </FormSection>
    </Layout>
  );
}
