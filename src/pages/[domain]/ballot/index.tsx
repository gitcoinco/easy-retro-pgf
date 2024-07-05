import { useBallot } from "~/features/ballot/hooks/useBallot";
import { LayoutWithBallot } from "~/layouts/DefaultLayout";
import { BallotProvider } from "~/features/ballot/components/BallotProvider";
import { useProjectsById } from "~/features/projects/hooks/useProjects";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { BallotEditor } from "~/features/ballot/components/BallotEditor";
import { RoundTypes } from "~/features/rounds/types";

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
          items={projects.data}
          type={RoundTypes.project}
          isLoading={isPending}
        />
      </LayoutWithBallot>
    </BallotProvider>
  );
}
