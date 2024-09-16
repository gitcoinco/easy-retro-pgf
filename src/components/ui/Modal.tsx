import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode, PropsWithChildren, ComponentProps } from "react";
import { IconButton } from "./Button";
import { createComponent } from ".";
import { tv } from "tailwind-variants";
import { X } from "lucide-react";
import { theme } from "~/config";

export const Modal = ({
  title,
  size,
  isOpen,
  children,
  onOpenChange,
}: {
  title?: string | ReactNode;
  isOpen?: boolean;
  size?: "sm" | "md";
  onOpenChange?: ComponentProps<typeof RadixDialog.Root>["onOpenChange"];
} & PropsWithChildren) => {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed left-0 top-0 z-10 h-full w-full bg-black/70" />
        {/* Because of Portal we need to set the theme here */}
        <div className={theme.colorMode}>
          <Content size={size}>
            <RadixDialog.Title className="mb-6 text-2xl font-bold">
              {title}
            </RadixDialog.Title>
            {children}
            <RadixDialog.Close asChild>
              <IconButton
                icon={X}
                variant="ghost"
                className={`absolute right-4 top-4 ${!onOpenChange && "hidden"}`}
              ></IconButton>
            </RadixDialog.Close>
          </Content>
        </div>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
const Content = createComponent(
  RadixDialog.Content,
  tv({
    base: "z-20 fixed bottom-0 rounded-t-2xl bg-white dark:bg-gray-900 dark:text-white px-7 py-6 w-full sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl",
    variants: {
      size: {
        sm: "sm:w-[456px] md:w-[456px]",
        md: "sm:w-[456px] md:w-[800px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }),
);
