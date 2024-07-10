"use client";

import { Layout } from "~/layouts/DefaultLayout";

import { ApplicationForm } from "~/features/applications/components/ApplicationForm";
import { useAccount } from "wagmi";
import { Alert } from "~/components/ui/Alert";
import { FormSection } from "~/components/ui/Form";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";

export default function NewProjectPage() {
  const { address } = useAccount();

  const roundState = useRoundState();
  const isNotApplicationPeriod = roundState !== "APPLICATION";

  return (
    <Layout>
      {isNotApplicationPeriod ? (
        <FormSection
          title="New application"
          description={
            <Alert
              className="mt-4"
              variant="info"
              title="Application period has ended"
            />
          }
        ></FormSection>
      ) : (
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
            <Alert variant="info" title="Connect your wallet to continue" />
          )}
        </FormSection>
      )}
    </Layout>
  );
}
