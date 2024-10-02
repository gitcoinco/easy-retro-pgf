import { tv } from "tailwind-variants";
import { createComponent } from "~/components/ui";

export const ProgressWrapper = createComponent(
  "div",
  tv({
    base: "absolute h-full w-4/5 overflow-hidden rounded-xl",
  }),
);

export const ProgressBar = createComponent(
  "div",
  tv({
    base: "h-full bg-yellow-100 dark:bg-yellow-700",
    variants: {
      variant: {
        default: "",
        gradient:
          "bg-gradient-to-r from-yellow-50 to-yellow-100 transition-all dark:from-yellow-600 dark:to-yellow-700",
        "gradient-end":
          "bg-gradient-to-r from-yellow-100 to-yellow-200 transition-all dark:from-yellow-700 dark:to-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }),
);
