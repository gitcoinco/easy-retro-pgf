import { useAccount } from "wagmi";
import { RoundProgress } from "~/features/info/components/RoundProgress";
import { Layout } from "~/layouts/DefaultLayout";
import { Alert } from "~/components/ui/Alert";

export default function InfoPage() {
  const { address } = useAccount();

  return (
    <Layout>
      {address ? (
        <RoundProgress />
      ) : (
        <Alert variant="info" title="Connect your wallet to continue"></Alert>
      )}
    </Layout>
  );
}
