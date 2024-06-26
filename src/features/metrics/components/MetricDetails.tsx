"use client";

import { Heading } from "~/components/ui/Heading";
import { Markdown } from "~/components/ui/Markdown";

type MetricDetailsProps = {
  name: string;
  description: string;
};

export default function MetricDetails({
  name = "",
  description = "",
}: MetricDetailsProps) {
  return (
    <>
      <Heading as="h2" size="2xl">
        {name}
      </Heading>
      <Markdown>{description}</Markdown>
    </>
  );
}
