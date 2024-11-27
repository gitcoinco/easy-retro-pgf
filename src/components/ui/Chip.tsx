import { tv } from "tailwind-variants";
import { createComponent } from ".";

const chip = tv({
  base: "bg-gray-100 hover:bg-gray-300 rounded-lg min-w-[42px] px-2 md:px-3 py-2 cursor-pointer inline-flex justify-center items-center whitespace-nowrap text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors",
  variants: {},
});

export const Chip = createComponent("button", chip);
