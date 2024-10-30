import { type ComponentProps } from "react";
import { tv } from "tailwind-variants";
import { AlbumIcon, CheckIcon, PlusIcon } from "lucide-react";

import { createComponent } from "~/components/ui";

const ActionButton = createComponent(
  "button",
  tv({
    base: "flex h-6 w-6 items-center justify-center rounded-lg border-2 border-transparent transition-colors bg-gray-100",
    variants: {
      color: {
        default:
          "hover:bg-gray-200",
        highlight:
          "hover:bg-white",
        green:
          "border-transparent border-gray-100 text-gray-500",
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
    <ActionButton role="button" disabled={state === 2} color={color} {...props}>
      <Icon className="h-4 w-4" />
    </ActionButton>
  );
}
