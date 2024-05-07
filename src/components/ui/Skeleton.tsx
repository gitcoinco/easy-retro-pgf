import { type ComponentProps } from "react";
import clsx from "clsx";
import { cn } from "~/utils/classNames";

export const Skeleton = ({
  isLoading = false,
  className,
  children,
}: ComponentProps<"span"> & { isLoading?: boolean }) =>
  isLoading ? (
    <span
      className={cn(
        "inline-flex h-full min-w-[20px] animate-pulse rounded bg-gray-200 dark:bg-surfaceContainerLow-dark",
        className,
      )}
    />
  ) : (
    <>{children}</>
  );
