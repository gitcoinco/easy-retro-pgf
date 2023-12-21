import { tv } from "tailwind-variants";
import { createComponent } from ".";
import { BackgroundImage } from "./BackgroundImage";

export const Avatar = createComponent(
  BackgroundImage,
  tv({
    base: "bg-gray-200 dark:bg-gray-800",
    variants: {
      size: {
        xs: "w-5 h-5 rounded-xs",
        sm: "w-12 h-12 rounded-md",
        md: "w-16 h-16 rounded-md",
        lg: "w-40 h-40 rounded-3xl",
      },
      rounded: {
        full: "rounded-full",
      },
      bordered: {
        true: "outline outline-white dark:outline-gray-900",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }),
);
