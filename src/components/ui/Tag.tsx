import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Tag = createComponent(
  "div",
  tv({
    base: "cursor-pointer inline-flex items-center justify-center gap-2 bg-gray-200 dark:border dark:border-outline-dark dark:bg-transparent dark:text-onSurfaceVariant-dark whitespace-nowrap transition",
    variants: {
      size: {
        sm: "rounded-lg py-1 px-3 text-sm",
        md: "rounded-lg py-1.5 px-3 text-sm",
        lg: "rounded-xl py-2 px-4 text-lg",
      },
      selected: {
        true: "border border-gray-900 dark:border-onSurfaceVariant-dark",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }),
);
