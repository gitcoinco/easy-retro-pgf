import React from "react";
import Link from "next/link";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { Metric } from "~/features/metrics/types";
import { Card } from "~/components/ui/Card";

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
  const domain = useCurrentDomain();

  return (
    <Card type="metrics">
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
              <div className="text-lg hover:underline">
                <Link href={href}>{metric?.name}</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-muted animate-pulse rounded-md ${className}`}
      {...props}
    />
  );
}
