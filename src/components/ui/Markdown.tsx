import clsx from "clsx";
import { type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";

export function Markdown({
  isLoading,
  ...props
}: { isLoading?: boolean } & ComponentProps<typeof ReactMarkdown>) {
  return (
    <div
      className={clsx("prose max-w-none dark:prose-invert", {
        ["h-96 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"]:
          isLoading,
      })}
    >
      <ReactMarkdown {...props} />
    </div>
  );
}
