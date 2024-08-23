import React from "react";
import Link from "next/link";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import type { Metric } from "~/types/metrics";
import { Skeleton } from "~/components/ui/Skeleton";
import { AddToBallotButton } from "./AddToBallotButton";
import { ErrorMessage } from "~/components/ErrorMessage";
import { useMetrics } from "../hooks/useMetrics";
import { Heading } from "~/components/ui/Heading";
import { Markdown } from "~/components/ui/Markdown";
import { snakeToTitleCase } from "~/utils/formatStrings";

export function MetricsList() {
  const { data, error, isPending } = useMetrics();

  if (error) return <ErrorMessage error={error} />;

  return (
    <section className="space-y-4">
      {isPending
        ? Array(5)
            .fill(0)
            .map((_, i) => <MetricCard key={i} isLoading />)
        : data.map((metric, i) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
    </section>
  );
}
function MetricCard({
  metric,
  isLoading,
}: {
  isLoading?: boolean;
  metric?: Metric;
}) {
  const domain = useCurrentDomain();
  return (
    <div className={"rounded border p-6 "}>
      <div className="flex gap-8">
        <div className="flex-1 space-y-4">
          {/* Review: Do we need to show metric name as this is included in description */}
          {/* {isLoading ? (
            <Skeleton isLoading className="block h-6 w-48" />
          ) : (
            <Heading variant="h3" className="hover:underline">
              <Link href={`/${domain}/metrics/${metric?.id}`}>
                {snakeToTitleCase(metric?.name)}
              </Link>
            </Heading>
          )} */}
          {isLoading ? (
            <Skeleton isLoading className="block h-12" />
          ) : (
            <Link href={`/${domain}/metrics/${metric?.id}`} className="hover:underline  underline-offset-2">
              <Markdown className={"line-clamp-2 text-gray-700"}>
                {metric?.description}
              </Markdown>
            </Link>
          )}
        </div>
        <AddToBallotButton id={metric?.id} />
      </div>
    </div>
  );
}
