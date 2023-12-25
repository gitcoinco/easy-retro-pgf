import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Badge = createComponent(
  "div",
  tv({
    base: "inline-flex items-center rounded px-1 font-semibold text-gray-500 text-sm",
    variants: {
      variant: {
        default: "bg-gray-100 dark:bg-gray-800",
        success: "dark:bg-green-300 dark:text-green-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }),
);
