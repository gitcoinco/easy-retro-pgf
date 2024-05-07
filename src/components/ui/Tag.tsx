import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Tag = createComponent(
  "div",
  tv({
    base: "cursor-pointer inline-flex items-center justify-center gap-2 bg-gray-200 dark:border dark:border-outline-dark dark:bg-transparent dark:text-outline-dark whitespace-nowrap transition",
    variants: {
      size: {
        sm: "rounded-full py-1 px-3 text-sm",
        md: "rounded-lg py-1.5 px-3 text-sm",
        lg: "rounded-full py-2 px-4 text-lg",
      },
      selected: {
        true: "border border-gray-900 dark:border-onPrimary-light dark:text-onPrimary-light",
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
