import { Layout } from "~/layouts/DefaultLayout";
import { ApplicationForm } from "~/features/applications/components/ApplicationForm";
import { useAccount } from "wagmi";
import { getAppState } from "~/utils/state";
import { Alert } from "~/components/ui/Alert";

export default function NewProjectPage() {
  const { address } = useAccount();
  const state = getAppState();

  return (
    <Layout>
      <h3 className="mb-1 text-2xl font-semibold">New Application</h3>
      <hr />
      <p className="leading-loose text-gray-600 dark:text-gray-400">
        Fill out this form to create an application for your project. Fields
        with a red star <span className="text-red-500 font-semibold">*</span> are
        mandatory. Your progress is saved locally so you can return to this page
        to resume your application. Please refer only to the impact you have created between April - September 2024 when filling out the form.
      </p>
      <hr className="mb-8" />
      {state !== "APPLICATION" ? (
        <Alert variant="info" title="Application period has ended"></Alert>
      ) : address ? (
        <ApplicationForm />
      ) : (
        <Alert variant="info" title="Connect your wallet to continue"></Alert>
      )}
    </Layout>
  );
}
