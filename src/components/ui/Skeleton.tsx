import { type ComponentProps } from "react";
import clsx from "clsx";

export const Skeleton = ({
  isLoading = false,
  className,
  children,
}: ComponentProps<"span"> & { isLoading?: boolean }) =>
  isLoading ? (
    <span
      className={clsx(
        "inline-flex h-full min-w-[20px] animate-pulse rounded bg-gray-200 dark:bg-gray-800",
        className,
      )}
    />
  ) : (
    <>{children}</>
  );
