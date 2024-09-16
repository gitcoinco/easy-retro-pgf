import { BallotConfirmation } from "~/features/ballot/components/BallotConfirmation";
import { useBallot } from "~/features/ballot/hooks/useBallot";
import { Layout } from "~/layouts/DefaultLayout";

export default function BallotConfirmationPage() {
  const { data: ballot } = useBallot();

  if (!ballot) return null;

  return (
    <Layout requireAuth>
      <BallotConfirmation
        votes={ballot?.votes.sort((a, b) => +b.amount - +a.amount)}
      />
    </Layout>
  );
}
