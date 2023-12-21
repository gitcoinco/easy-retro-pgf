import { tv } from "tailwind-variants";
import { createComponent } from "~/components/ui";
import { BackgroundImage } from "./BackgroundImage";

export const Banner = createComponent(
  BackgroundImage,
  tv({
    base: "bg-gray-200 dark:bg-gray-800",
    variants: {
      size: {
        md: "h-24 rounded-2xl",
        lg: "h-80 rounded-3xl",
      },
      rounded: {
        full: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }),
);
