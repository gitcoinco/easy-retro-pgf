import { format } from "date-fns";
import { tv } from "tailwind-variants";
import { createComponent } from "~/components/ui";
import { config } from "~/config";
import { cn } from "~/utils/classNames";
import { formatDate } from "~/utils/time";

const steps = [
  {
    label: "Showcase",
    date: config.showcaseStartsAt,
  },
  /* {
    label: "Review & Approval",
    date: config.registrationEndsAt,
  }, */
  {
    label: "Registration",
    date: config.startsAt,
  },
  {
    label: "Voting",
    date: config.reviewEndsAt,
  },
  // {
  //   label: "Tallying",
  //   date: config.votingEndsAt,
  // },
  {
    label: "Distribution",
    date: config.resultsAt,
  },
];

export function RoundProgress() {
  const { progress, currentStepIndex } = calculateProgress(steps);

  return (
    <div className="relative my-4">
      <ProgressWrapper
        className={cn({
          ["w-full"]: currentStepIndex === steps.length,
        })}
      >
        <ProgressBar style={{ width: `${progress * 100}%` }} />
      </ProgressWrapper>
      <div className="relative z-10 rounded-xl border border-yellow-400 md:flex">
        {steps.map((step, i) => (
          <div
            key={i}
            className={cn(
              "z-20 flex-1  rounded-xl border-l border-yellow-400 p-4 ",
              {
                ["opacity-50"]: currentStepIndex <= i,
              },
            )}
          >
            <h3 className="font-semibold">{step.label}</h3>
            <div>
              {format(step.date, i === 3 ? "MMM yyyy" : "dd MMM yyyy")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ProgressWrapper = createComponent(
  "div",
  tv({
    base: "absolute hidden h-full w-4/5 overflow-hidden rounded-xl border-y border-yellow-400 md:block",
  }),
);
const ProgressBar = createComponent(
  "div",
  tv({
    base: "h-full  bg-gradient-to-r from-yellow-50 to-yellow-200 transition-all dark:from-yellow-600 dark:to-yellow-700",
  }),
);

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
