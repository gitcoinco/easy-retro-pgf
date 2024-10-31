import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Tag = createComponent(
  "div",
  tv({
    base: "cursor-pointer inline-flex items-center justify-center gap-2 bg-gray-100 border border-gray-100 text-gray-800 whitespace-nowrap transition",
    variants: {
      size: {
        sm: "rounded py-1 px-2 text-xs",
        md: "rounded-lg py-1.5 px-3 text-sm",
        lg: "rounded-xl py-2 px-4 text-lg",
      },
      selected: {
        true: "border-gray-900",
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
