import { useAccount } from "wagmi";
import { ApplicationsToApprove } from "~/features/applications/components/ApplicationsToApprove";
import { Layout } from "~/layouts/DefaultLayout";
import { Alert } from "~/components/ui/Alert";

export default function ApplicationsPage() {
  const { address } = useAccount();

  return (
    <Layout title="Review applications">
      {address ? (
        <ApplicationsToApprove />
      ) : (
        <Alert variant="info" title="Connect your wallet to continue"></Alert>
      )}
    </Layout>
  );
}
