import clsx from "clsx";
import { type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "./Link";

const components = {
  a: (p: ComponentProps<typeof Link>) => <Link target="_blank" {...p} />,
};
export function Markdown({
  isLoading,
  ...props
}: { isLoading?: boolean } & ComponentProps<typeof ReactMarkdown>) {
  return (
    <div
      className={clsx("prose prose-xl max-w-none dark:prose-invert pt-8", {
        ["h-96 animate-pulse rounded-xl bg-gray-100 dark:bg-surfaceContainerLow-dark "]:
          isLoading,
      })}
    >
      <ReactMarkdown components={components} {...props} />
    </div>
  );
}
