import clsx from "clsx";
import { type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "./Link";
import rehypeRaw from "rehype-raw";

const components = {
  a: (props: ComponentProps<typeof Link>) => (
    <Link target="_blank" {...props} />
  ),
  p: (props: ComponentProps<typeof Link>) => (
    <p className="break-words" {...props} />
  ),
};
export function Markdown({
  isLoading,
  ...props
}: { isLoading?: boolean } & ComponentProps<typeof ReactMarkdown>) {
  return (
    <div
      className={clsx("prose prose-xl max-w-none dark:prose-invert", {
        ["h-96 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"]:
          isLoading,
      })}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={components}
        {...props}
      />
    </div>
  );
}
