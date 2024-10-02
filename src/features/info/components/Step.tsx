import { format } from "date-fns";

import { cn } from "~/utils/classNames";
import { ProgressBar, ProgressWrapper } from "./ProgressBar";
import { calculateStepProgress } from "./utils";

export type StepWithDuration = {
  label: string;
  date: Date;
  duration?: number;
};

export type StepWithRange = {
  label: string;
  startDate: Date;
  endDate?: Date;
};

export type StepType = StepWithDuration | StepWithRange;

export type StepProps = {
  step: StepType;
  index?: number;
  nSteps?: number;
};

export function Step({ step, index, nSteps }: StepProps) {
  console.log("DEBUG", index, nSteps, step);
  const { progress } = calculateStepProgress(step);

  const isSingleStep =
    nSteps === 1 || index === undefined || nSteps === undefined;
  const isFirstStep = isSingleStep || index === 0;
  const isLastStep = isSingleStep || index === nSteps - 1;

  const dateText =
    "date" in step
      ? format(step.date, "MMM yyyy")
      : `${format(step.startDate, "dd MMM")}-${step.endDate ? format(step.endDate, "dd MMM yyyy") : "..."}`;

  return (
    <div className="relative flex-1">
      <ProgressWrapper
        className={cn({
          ["w-full"]: !isLastStep,
        })}
      >
        <ProgressBar
          variant={
            isFirstStep ? "gradient" : isLastStep ? "gradient-end" : "default"
          }
          style={{ width: `${progress * 100}%` }}
        />
      </ProgressWrapper>
      <div
        className={cn("relative border border-yellow-400 p-4", {
          ["opacity-50"]: progress === 0,
          ["rounded-l-none rounded-t-xl  md:rounded-l-xl md:rounded-tr-none"]:
            isFirstStep,
          ["rounded-b-xl rounded-r-none   md:rounded-r-xl md:rounded-bl-none"]:
            isLastStep,
        })}
      >
        <h3 className="font-semibold">{step.label}</h3>
        <div>{dateText}</div>
      </div>
    </div>
  );
}
