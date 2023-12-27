import { useAccount } from "wagmi";
import { Alert } from "~/components/ui/Alert";
import { Spinner } from "~/components/ui/Spinner";
import { useApprovedVoter } from "~/features/voters/hooks/useApprovedVoter";
import { Layout } from "~/layouts/DefaultLayout";

export default function VotersPage() {
  const { address } = useAccount();
  const approved = useApprovedVoter(address!);

  return (
    <Layout title="Manage voters">
      {approved.isLoading ? (
        <Alert className="flex justify-center">
          <Spinner className="size-6" />
        </Alert>
      ) : approved.data ? (
        <Alert title="You have been approved" variant="success">
          The connected wallet has been attested as an approved voter.
        </Alert>
      ) : (
        <Alert title="You have not been approved yet" variant="warning">
          The connected wallet has not been attested as an approved voter yet.
        </Alert>
      )}
    </Layout>
  );
}
