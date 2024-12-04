import { Layout } from "~/layouts/DefaultLayout";

import { ApplicationForm } from "~/features/applications/components/ApplicationForm";
import { CeloApplicationForm } from "~/features/applications/components/CeloApplicationForm";

import { useAccount } from "wagmi";
import { Alert } from "~/components/ui/Alert";
import { FormSection } from "~/components/ui/Form";
import { useIsCeloRound } from "~/hooks/useIsCeloRound";

export default function NewProjectPage() {
  const { address } = useAccount();
  const isCeloRound = useIsCeloRound();
  if (isCeloRound === null) {
    return null;
  }
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
          <div>
            {isCeloRound ? (
              <CeloApplicationForm address={address} />
            ) : (
              <ApplicationForm address={address} />
            )}
          </div>
        ) : (
          <Alert variant="info" title="Connect your wallet to continue"></Alert>
        )}
      </FormSection>
    </Layout>
  );
}
