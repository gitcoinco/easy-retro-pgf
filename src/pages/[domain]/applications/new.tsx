import { Layout } from "~/layouts/DefaultLayout";

import { ApplicationForm } from "~/features/applications/components/ApplicationForm";
import { useAccount } from "wagmi";
import { Notification } from "~/components/ui/Notification";
import { Alert } from "~/components/ui/Alert";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";

export default function NewProjectPage() {
  const { address } = useAccount();
  const roundState = useRoundState();

  return (
    <Layout>
      {roundState !== "APPLICATION" && (
        <Notification className="justify-self-center" title="Application period has ended" />
      )}
  
        {address ? (
          <ApplicationForm address={address} />
        ) : (
          <Alert variant="info" title="Connect your wallet to continue"></Alert>
        )}
   
    </Layout>
  );
}
