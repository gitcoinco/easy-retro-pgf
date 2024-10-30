import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Badge = createComponent(
  "div",
  tv({
    base: "inline-flex justify-center h-10 items-center rounded font-semibold text-gray-500 text-sm",
    variants: {
      variant: {
        default: "bg-gray-100",
        success: "bg-primary-100 text-[#16968e]", //check the color
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
