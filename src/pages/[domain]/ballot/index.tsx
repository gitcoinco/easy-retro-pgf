import { Form } from "~/components/ui/Form";
import { useBallot } from "~/features/ballot/hooks/useBallot";
import { BallotSchema } from "~/features/ballot/types";
import { BallotAllocationForm } from "~/features/ballot/components/BallotAllocationForm";
import { LayoutWithBallot } from "~/layouts/DefaultLayout";

export default function BallotPage() {
  const { data: ballot, isPending } = useBallot();

  if (isPending) return null;

  const votes = ballot?.votes.sort((a, b) => b.amount - a.amount);
  return (
    <LayoutWithBallot sidebar="right" requireAuth>
      <Form
        schema={BallotSchema}
        defaultValues={{ votes }}
        onSubmit={console.log}
      >
        <BallotAllocationForm isPublished={Boolean(ballot?.publishedAt)} />
      </Form>
      <div className="py-8" />
    </LayoutWithBallot>
  );
}
