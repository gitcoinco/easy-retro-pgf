import { type ComponentProps } from "react";
import { tv } from "tailwind-variants";
import { AlbumIcon, CheckIcon, PlusIcon } from "lucide-react";

import { createComponent } from "~/components/ui";

const ActionButton = createComponent(
  "button",
  tv({
    base: "flex h-6 w-6 items-center justify-center rounded-full border-2 border-transparent transition-colors bg-gray-100 dark:bg-gray-900",
    variants: {
      color: {
        default:
          "dark:border-white/50 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:border-white",
        highlight:
          "hover:bg-white dark:hover:bg-gray-800 dark:border-white dark:text-white",
        green:
          "border-transparent border-gray-100 dark:border-gray-900 text-gray-500",
      },
    },
    defaultVariants: { color: "default" },
  }),
);

type Props = { state: 2 | 1 | 0 } & ComponentProps<typeof ActionButton>;

export function ProjectSelectButton({ state, ...props }: Props) {
  const { color, icon: Icon } = {
    0: { color: "default", icon: PlusIcon },
    1: { color: "highlight", icon: CheckIcon },
    2: { color: "green", icon: AlbumIcon },
  }[state];

  return (
    <ActionButton color={color} {...props}>
      <Icon className="h-4 w-4" />
    </ActionButton>
  );
}
