import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Tabs = createComponent(
  "div",
  tv({ base: "inline-flex gap-2 bg-gray-100 p-1 rounded-lg" }),
);
export const Tab = createComponent(
  "button",
  tv({
    base: "py-2 px-3 rounded hover:bg-gray-50",
    variants: {
      isActive: { true: "bg-white" },
    },
  }),
);
