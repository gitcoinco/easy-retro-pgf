import { type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "./Link";
import { tv } from "tailwind-variants";

const markdownVariants = tv({
  base: "prose",
  variants: {
    type: {
      standard: "max-w-none dark:prose-invert",
      metrics: "line-clamp-2 text-gray-700",
    },
    isLoading: {
      true: "h-96 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800",
    },
  },
  defaultVariants: {
    type: "standard",
    isLoading: false,
  },
});

const components = {
  a: (p: ComponentProps<typeof Link>) => <Link target="_blank" {...p} />,
};
export function Markdown({
  isLoading,
  type,
  ...props
}: { isLoading?: boolean; type?: "metrics" } & ComponentProps<
  typeof ReactMarkdown
>) {
  const className = markdownVariants({ isLoading, type });
  return (
    <div className={className}>
      <ReactMarkdown components={components} {...props} />
    </div>
  );
}
