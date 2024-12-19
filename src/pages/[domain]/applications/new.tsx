import { Layout } from "~/layouts/DefaultLayout";
import { ApplicationForm } from "~/features/applications/components/ApplicationForm";
import { CeloApplicationForm } from "~/features/applications/components/CeloApplicationForm";
import { DripsApplicationForm } from "~/features/applications/components/DripsApplicationForm";
import { useAccount } from "wagmi";
import { Notification } from "~/components/ui/Notification";
import { Alert } from "~/components/ui/Alert";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import { useRoundType } from "~/hooks/useRoundType";

export default function NewProjectPage() {
  const { address } = useAccount();
  const roundState = useRoundState();
  const roundType = useRoundType();
  const isCeloRound = roundType === "CELO";
  const isDripRound = roundType === "DRIP";
  if (roundType === null) {
    return null;
  }
  return (
    <Layout>
      {roundState !== "APPLICATION" && (
        <Notification className="justify-self-center" title="Application period has ended" />
      )}
  
        {address ? (
          <div>
            {isCeloRound ? (
              <CeloApplicationForm address={address} />
            ) : isDripRound ? (
              <DripsApplicationForm address={address} />
            ) : (
              <ApplicationForm address={address} />
            )}
          </div>
        ) : (
          <Alert variant="info" title="Connect your wallet to continue"></Alert>
        )}
   
    </Layout>
  );
}
