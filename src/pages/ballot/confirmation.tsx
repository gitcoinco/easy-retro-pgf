import { useMaci } from "~/contexts/Maci";
import { BallotConfirmation } from "~/features/ballot/components/BallotConfirmation";
import { Layout } from "~/layouts/DefaultLayout";

export default function BallotConfirmationPage() {
  const { ballot } = useMaci();

  if (!ballot) return null;

  return (
    <Layout requireAuth>
      <BallotConfirmation
        votes={ballot?.votes.sort((a, b) => +b.amount - +a.amount)}
      />
    </Layout>
  );
}
