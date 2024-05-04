import { useAccount } from "wagmi";
import { useIsAdmin } from "~/hooks/useIsAdmin";
import { ApplicationsToApprove } from "~/features/applications/components/ApplicationsToApprove";
import { Layout } from "~/layouts/DefaultLayout";
import { Alert } from "~/components/ui/Alert";

export default function ApplicationsPage() {
  const { address } = useAccount();
  const isAdmin = useIsAdmin();

  return (
    <Layout title="Review applications">
      {!address ? (
        <Alert variant="info" title="Connect your wallet to continue"></Alert>
      ) : !isAdmin ? (
        <Alert variant="info" title="Only admin can see this page"></Alert>
      ) : (
        <ApplicationsToApprove />
      )}
    </Layout>
  );
}
