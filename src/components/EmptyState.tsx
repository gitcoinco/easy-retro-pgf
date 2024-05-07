import { type PropsWithChildren } from "react";
import { Heading } from "./ui/Heading";

export function EmptyState({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <Heading className="mt-0" as="h3" size="lg">
        {title}
      </Heading>
      <div>{children}</div>
    </div>
  );
}
