import type { StepWithDuration, StepWithRange } from "./Step";

export function calculateStepProgress(step: StepWithDuration | StepWithRange) {
  const now = Number(new Date());

  const date = "date" in step ? step.date : undefined;
  const startDate = "startDate" in step ? step.startDate : step.date;
  const endDate = "endDate" in step ? step.endDate : undefined;

  const isAfterDate = !!date && now >= Number(date);
  const isAfterStartDate = now >= Number(startDate);
  const isAfterEndDate = !!endDate && now >= Number(endDate);

  const timeElapsed = now - Number(startDate);
  const duration = Number(endDate) - Number(startDate);

  const result = { progress: 0 };

  if (isAfterEndDate || isAfterDate) {
    result.progress = 1;
  } else if (isAfterStartDate) {
    result.progress = timeElapsed / duration;
  }
  return result;
}
