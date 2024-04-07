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

const button = tv({
  base: "inline-flex items-center justify-center font-semibold text-center transition-colors rounded-full duration-150 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:ring-offset-gray-800",
  variants: {
    variant: {
      primary:
        "bg-primary-600 hover:bg-primary-700 dark:bg-white dark:hover:bg-primary-500 dark:text-gray-900 text-white dark:disabled:bg-gray-500",
      ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
      default:
        "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700",
      inverted: "bg-white text-black hover:bg-white/90",
      link: "bg-none hover:underline",
      outline: "border-2 hover:bg-white/5",
    },
    size: {
      sm: "px-3 py-2 h-10 min-w-[40px]",
      deafult: "px-4 py-2 h-12",
      icon: "h-12 w-12",
    },
    disabled: {
      true: "dark:text-gray-400 pointer-events-none pointer-default opacity-50 border-none",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "deafult",
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
