import { tv } from "tailwind-variants";
import { createComponent } from ".";

const chip = tv({
  base: "border border-gray-700 rounded-full min-w-[42px] px-2 md:px-3 py-2 cursor-pointer inline-flex justify-center items-center whitespace-nowrap text-gray-700 dark:text-gray-200 dark:hover:text-gray-100 hover:text-gray-900",
  variants: {},
});

export const Chip = createComponent("button", chip);
