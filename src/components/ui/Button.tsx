import { tv } from "tailwind-variants";
import { createComponent } from ".";
import {
  type ComponentPropsWithRef,
  type FunctionComponent,
  createElement,
  forwardRef,
} from "react";
import { cn } from "~/utils/classNames";
import { Spinner } from "./Spinner";

export const button = tv({
  base: "inline-flex items-center justify-center font-semibold text-center transition-colors h-10 py-3 backdrop-blur-sm  gap-2.5 rounded-lg duration-150 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  variants: {
    variant: {
      primary:
        "bg-primary-600 hover:bg-primary-500 text-[#182d32]",
      ghost: "hover:bg-gray-100",
      default:
        "bg-gray-100 hover:bg-gray-50",
      danger:
        "bg-red-600 text-white hover:bg-red-500",
      outline: "border border-gray-300 hover:bg-white/5 hover:border-gray-400",
    },
    size: {
      sm: "px-3 py-2 h-10 min-w-[40px]",
      md: "px-6 py-2 h-12",
      lg: "px-6 py-3 text-lg",
      icon: "h-12 w-12",
    },
    disabled: {
      true: "pointer-events-none pointer-default opacity-50 border-none",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const ButtonComponent = createComponent("button", button);

export const IconButton = forwardRef(function IconButton(
  {
    children,
    icon,
    size,
    ...props
  }: // eslint-disable-next-line
  { icon: any; size?: string } & ComponentPropsWithRef<typeof Button>,
  ref,
) {
  return (
    <Button ref={ref} {...props} size={children ? size : "icon"}>
      {icon
        ? createElement(icon, {
            className: `w-4 h-4 ${children ? "mr-2" : ""}`,
          })
        : null}
      {children}
    </Button>
  );
});

export function Button({
  icon,
  children,
  isLoading,
  ...props
}: ComponentPropsWithRef<typeof ButtonComponent> & {
  /*eslint-disable @typescript-eslint/no-explicit-any */
  icon?: FunctionComponent<any>;
  isLoading?: boolean;
}) {
  const Icon = isLoading ? Spinner : icon;
  return (
    <ButtonComponent
      type="button"
      role="button"
      disabled={isLoading}
      size={icon && !children ? "icon" : undefined}
      {...props}
    >
      {Icon &&
        createElement(Icon, {
          className: cn("size-4", { ["mr-2"]: Boolean(children) }),
        })}
      {children}
    </ButtonComponent>
  );
}
