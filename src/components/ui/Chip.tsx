import { tv } from "tailwind-variants";
import { createComponent } from ".";

const chip = tv({
  base: "border text-xs md:text-base border-onPrimary-light rounded-full min-w-[42px] px-2 md:px-3 py-2 cursor-pointer inline-flex justify-center items-center whitespace-nowrap text-onPrimary-light dark:hover:text-primary-dark dark:hover:border-primary-dark dark:hover:stroke-primary-dark",
  variants: {},
});

export const Chip = createComponent("button", chip);
