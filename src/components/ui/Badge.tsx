import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Badge = createComponent(
  "div",
  tv({
    base: "inline-flex items-center rounded font-semibold text-gray-500 text-sm",
    variants: {
      variant: {
        default: "bg-gray-100 dark:bg-surfaceContainerLow-dark",
        success: "bg-green-100 dark:bg-green-300 text-green-900",
      },
      size: {
        md: "px-1",
        lg: "px-2 py-1 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }),
);
