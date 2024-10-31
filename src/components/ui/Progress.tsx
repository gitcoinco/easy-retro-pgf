import { tv } from "tailwind-variants";
import { createComponent } from ".";
import { cn } from "~/utils/classNames";

const ProgressWrapper = createComponent(
  "div",
  tv({
    base: "h-1 rounded-lg bg-gray-200 relative overflow-hidden",
  }),
);

export const Progress = ({ value = 0, max = 100 }) => (
  <ProgressWrapper>
    <div
      className={cn("absolute h-1 rounded-lg transition-all", {
        ["bg-primary-600"]: value <= max,
        ["bg-red-600"]: value > max,
      })}
      style={{ width: `${(value / max) * 100}%` }}
    />
  </ProgressWrapper>
);
