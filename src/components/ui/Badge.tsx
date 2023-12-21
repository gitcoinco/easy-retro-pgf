import { tv } from "tailwind-variants";
import { createComponent } from ".";
import { type ComponentPropsWithRef, createElement, forwardRef } from "react";

export const Badge = createComponent(
  "div",
  tv({
    base: "inline-flex items-center rounded px-1 bg-gray-100 dark:bg-gray-800 font-semibold text-gray-500 text-sm",
  }),
);

export const IconBadge = forwardRef(function IconBadge(
  {
    children,
    icon,
    size,
    ...props
  }: // eslint-disable-next-line
  { icon: any; size?: string } & ComponentPropsWithRef<typeof Badge>,
  ref,
) {
  return (
    <Badge ref={ref} {...props} size={children ? size : "icon"}>
      {createElement(icon, { className: `w-4 h-4 ${children ? "mr-1" : ""}` })}
      {children}
    </Badge>
  );
});
