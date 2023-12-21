import type { ComponentPropsWithRef, ReactNode, ElementType } from "react";
import { forwardRef } from "react";

export type PolymorphicRef<C extends ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type ComponentProps<C extends ElementType> = {
  as?: C;
  children?: ReactNode;
} & ComponentPropsWithRef<C>;

export function createComponent<T extends ElementType, TV>(
  tag: T,
  variant: TV
) {
  return forwardRef(function UIComponent<C extends ElementType>(
    props: ComponentPropsWithRef<C & T>,
    ref?: PolymorphicRef<C>
  ) {
    const { as: Component = tag, className, ...rest } = props;
    return (
      <Component
        ref={ref}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/ban-types
        className={(variant as Function)({ class: className, ...props })}
        {...rest}
      />
    );
  });
}
