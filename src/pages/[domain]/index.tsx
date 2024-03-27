import type { GetServerSidePropsContext } from "next";
import { Layout } from "~/layouts/DefaultLayout";
import { cn } from "~/utils/classNames";
import { formatDate } from "~/utils/time";
import { Markdown } from "~/components/ui/Markdown";
import { type RoundSchema } from "~/features/rounds/types";
import { Button } from "~/components/ui/Button";
import Link from "next/link";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

export default function RoundPage() {
  const round = useCurrentRound();

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold">{round.data?.name}</h1>
        <Button
          as={Link}
          variant="primary"
          href={`/${round.data?.domain}/applications/new`}
        >
          Apply with your project
        </Button>
      </div>
      {round.data && <RoundProgress {...round.data} />}
      <Markdown>{round.data?.description}</Markdown>
    </Layout>
  );
}

function RoundProgress({
  startsAt,
  reviewAt,
  votingAt,
  resultAt,
  payoutAt,
}: Partial<RoundSchema>) {
  const steps = [];
  if (startsAt) steps.push({ label: "Registration", date: startsAt });
  if (reviewAt) steps.push({ label: "Review & Approval", date: reviewAt });
  if (votingAt) steps.push({ label: "Voting", date: votingAt });
  if (resultAt) steps.push({ label: "Tallying", date: resultAt });
  if (payoutAt) steps.push({ label: "Distribution", date: payoutAt });

  const { progress, currentStepIndex } = calculateProgress(steps);

  return (
    <div className="relative my-4">
      <div className="absolute hidden h-full w-4/5 overflow-hidden rounded-xl border-y border-yellow-400 md:block">
        <div
          className={
            "h-full  bg-gradient-to-r from-yellow-50 to-yellow-200 transition-all dark:bg-yellow-700"
          }
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="rounded-xl border md:flex">
        {steps.map((step, i) => (
          <div
            key={i}
            className={cn(
              "z-10 flex-1  rounded-xl border-l border-yellow-400 p-4 transition-opacity",
              {
                ["opacity-50"]: currentStepIndex <= i,
              },
            )}
          >
            <h3 className="font-semibold">{step.label}</h3>
            <div>{formatDate(step.date)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function calculateProgress(steps: { label: string; date: Date }[]) {
  const now = Number(new Date());

  let currentStepIndex = steps.findIndex(
    (step, index) =>
      now < Number(step.date) &&
      (index === 0 || now >= Number(steps[index - 1]?.date)),
  );

  if (currentStepIndex === -1) {
    currentStepIndex = steps.length;
  }

  let progress = 0;

  if (currentStepIndex > 0) {
    // Calculate progress for completed segments
    for (let i = 0; i < currentStepIndex - 1; i++) {
      progress += 1 / (steps.length - 1);
    }

    // Calculate progress within the current segment
    const segmentStart =
      currentStepIndex === 0 ? 0 : Number(steps[currentStepIndex - 1]?.date);
    const segmentEnd = Number(steps[currentStepIndex]?.date);
    const segmentDuration = segmentEnd - segmentStart;
    const timeElapsedInSegment = now - segmentStart;

    progress +=
      Math.min(timeElapsedInSegment, segmentDuration) /
      segmentDuration /
      (steps.length - 1);
  }

  progress = Math.min(Math.max(progress, 0), 1);

  return { progress, currentStepIndex };
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { domain } = ctx.query;
  return { props: { domain } };
};
