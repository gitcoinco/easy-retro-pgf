import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Badge = createComponent(
  "div",
  tv({
    base: "inline-flex items-center rounded font-semibold text-gray-500 text-sm",
    variants: {
      variant: {
        default: "bg-gray-100 dark:bg-gray-800",
        warning: "bg-red-100 dark:bg-red-300 text-red-900",
        info: "bg-blue-100 dark:bg-blue-300 text-blue-900",
        success: "bg-green-100 dark:bg-green-300 text-green-900",
      },
      size: {
        xs: "px-1 text-xs",
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
