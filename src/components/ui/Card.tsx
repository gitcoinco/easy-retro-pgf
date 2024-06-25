import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Card = createComponent(
  "div",
  tv({
    base: "rounded-[20px] border p-2",
    variants: {
      type: {
        metrics: "p-6 bg-card text-card-foreground rounded-lg shadow-sm",
        standard: "cursor-pointer transition-colors hover:border-gray-400",
      },
    },
    defaultVariants: {
      type: "standard",
    },
  }),
);

export const CardTitle = createComponent(
  "h3",
  tv({
    base: "text-base md:text-lg font-bold",
  }),
);
