import clsx from "clsx";
import type { ComponentPropsWithRef } from "react";

export const BackgroundImage = ({
  src,
  fallbackSrc,
  isLoading,
  className,
  ...props
}: {
  src?: string;
  fallbackSrc?: string;
  isLoading?: boolean;
} & ComponentPropsWithRef<"div">) => (
  <div
    {...props}
    className={clsx(className, "bg-cover bg-center", {
      ["blur-[40px]"]: fallbackSrc && !src,
      ["animate-pulse bg-gray-100"]: isLoading,
    })}
    style={{ backgroundImage: `url("${src ?? fallbackSrc}")` }}
  />
);
