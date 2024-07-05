import { Form } from "~/components/ui/Form";
import { useBallot } from "~/features/ballotV2/hooks/useBallot";
import { BallotSchema } from "~/features/ballot/types";
import { BallotAllocationForm } from "~/features/ballot/components/BallotAllocationForm";
import { LayoutWithBallot } from "~/layouts/DefaultLayout";
import { BallotEditor } from "~/features/projects/components/BallotEditor";
import { BallotProvider } from "~/features/ballot/components/provider";
import { useProjectsById } from "~/features/projects/hooks/useProjects";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

export default function BallotPage() {
  const ballot = useBallot();
  const projects = useProjectsById(
    ballot.data?.allocations.map((v) => v.id) ?? [],
  );
  const round = useCurrentRound();

  const isPending = ballot.isPending || projects.isPending || round.isPending;

  if (isPending) return null;

  return (
    <BallotProvider>
      <LayoutWithBallot sidebar="right" requireAuth>
        <BallotEditor
          maxAllocation={round.data?.maxVotesProject ?? 0}
          projects={projects.data}
          isLoading={isPending}
        />
        {/* <Form
        schema={BallotSchema}
        defaultValues={{ votes }}
        onSubmit={console.log}
        >
        </Form>
      <div className="py-8" /> */}
        {/* <BallotAllocationForm isPublished={Boolean(ballot?.publishedAt)} /> */}
      </LayoutWithBallot>
    </BallotProvider>
  );
}
