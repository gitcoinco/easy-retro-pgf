"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Heading } from "~/components/ui/Heading";
import { Markdown } from "~/components/ui/Markdown";
import { AddToBallotButton } from "./AddToBallotButton";
import { Button } from "~/components/ui/Button";
import { api } from "~/utils/api";
import { Skeleton } from "~/components/ui/Skeleton";
import { snakeToTitleCase } from "~/utils/formatStrings";

type MetricDetailsProps = {
  id: string;
};

export default function MetricDetails({ id }: MetricDetailsProps) {
  const calculationUrl = "#"; // Provide a valid URL here
  const { data = [], isPending } = api.metrics.get.useQuery(
    { ids: [id] },
    { enabled: !!id },
  );
  const { name, description } = data[0] ?? {};
  return (
    <div className="space-y-6">
      {isPending ? (
        <>
          <Skeleton isLoading className="h-8 w-96" />
          <div className="space-y-2">
            <Skeleton isLoading className="h-4 w-full" />
            <Skeleton isLoading className="h-4 w-full" />
            <Skeleton isLoading className="h-4 w-4/5" />
          </div>
        </>
      ) : (
        <>
          <Heading variant="h2" size="2xl">
            {snakeToTitleCase(name)}
          </Heading>
          <Markdown>{description}</Markdown>
        </>
      )}

      <div className="flex items-center gap-2">
        <AddToBallotButton variant="primary" id={id} />
        <Link href={calculationUrl} target="_blank">
          <Button variant="link">
            View calculation
            <ArrowUpRight className="ml-1 size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
