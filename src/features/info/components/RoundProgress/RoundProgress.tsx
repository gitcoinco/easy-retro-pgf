import { config } from "~/config";
import { Step, type StepType } from "./Step";

export const steps: Array<StepType> = [
  {
    label: "Showcase",
    startDate: config.showcaseStartsAt,
    endDate: config.startsAt,
  },
  /* {
    label: "Review & Approval",
    date: config.registrationEndsAt,
  }, */
  {
    label: "Registration",
    startDate: config.startsAt,
    endDate: config.registrationEndsAt,
  },
  {
    label: "Voting",
    startDate: config.reviewStartsAt,
    endDate: config.votingEndsAt,
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
  return (
    <div className="relative z-10 rounded-xl border border-yellow-400 md:flex">
      {steps.map((step, i) => (
        <Step key={i} step={step} index={i} nSteps={steps.length} />
      ))}
    </div>
  );
}
