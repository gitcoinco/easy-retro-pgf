import React from "react";
import Link from "next/link";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { Metric } from "~/features/metrics/types";
import { Card } from "~/components/ui/Card";
import { Skeleton } from "~/components/ui/Skeleton";
import { AddToBallotButton } from "./AddToBallotButton";

export function MetricsList({
  metrics,
  isPending,
}: {
  metrics?: Metric[];
  isPending: boolean;
}) {
  const domain = useCurrentDomain();

  return (
    <section className="space-y-4">
      {isPending
        ? Array(5)
            .fill(0)
            .map((_, i) => <MetricCard key={i} isLoading />)
        : metrics?.map((metric) => (
            <MetricCard
              key={metric.id}
              href={`/${domain}/metrics/${metric?.id}`}
              metric={metric}
            />
          ))}
    </section>
  );
}

function MetricCard({
  metric,
  isLoading,
  href = "",
}: {
  isLoading?: boolean;
  metric?: Metric;
  href?: string;
}) {
  // Skeleton sizes should be fixed after the card design is finished

  return (
    <Card className="bg-card text-card-foreground rounded-lg p-6 shadow-sm">
      <div className="flex gap-8">
        <div className="flex-1 space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-12" />
              <Skeleton className="h-6 w-32" />
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <div className="text-lg hover:underline">
                  <Link href={href}>{metric?.name}</Link>
                </div>
                <AddToBallotButton id={metric.id} />
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
