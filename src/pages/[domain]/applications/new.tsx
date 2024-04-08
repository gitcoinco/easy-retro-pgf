import { Layout } from "~/layouts/DefaultLayout";

import { ApplicationForm } from "~/features/applications/components/ApplicationForm";
import { useAccount } from "wagmi";
import { Alert } from "~/components/ui/Alert";
import { FormSection } from "~/components/ui/Form";

export default function NewProjectPage() {
  const { address } = useAccount();

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
        {address ? (
          <ApplicationForm address={address} />
        ) : (
          <Alert variant="info" title="Connect your wallet to continue"></Alert>
        )}
      </FormSection>
    </Layout>
  );
}
