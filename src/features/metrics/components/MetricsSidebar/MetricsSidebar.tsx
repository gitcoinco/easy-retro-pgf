"use client";
import { useMemo, useState } from "react";

import { Card } from "~/components/ui/Card";
import { Heading } from "~/components/ui/Heading";
import { ScrollArea } from "~/components/ScrollArea";
import { DistributionChart } from "../DistributionChart";
import { Text } from "~/components/Text";
import { SortButton } from "./SortButton";
import { AllocationList } from "./AllocationList";
import { MetricProject } from "~/utils/fetchMetrics";

type MetricsSidebarProps = {
  projects: MetricProject[];
};

export function MetricsSidebar({ projects }: MetricsSidebarProps) {
  const [sort, setSort] = useState(false);

  const chart = useMemo(
    () =>
      (projects ?? [])
        .map((project, i) => ({ x: i, y: project.amount }))
        .sort((a, b) => (a.y < b.y ? (sort ? -1 : 1) : -1)),
    [projects, sort],
  );

  const title = "Distribution";
  const description = "For this particular metric";

  return (
    <Card className="sticky top-4 w-[300px]">
      <div className="p-3">
        <Heading size="xl">{title}</Heading>
        {description && <Text>{description}</Text>}
      </div>
      <div className="space-y-2 p-3">
        <div className="space-y-1">
          <div className="h-32 rounded-lg border">
            <DistributionChart data={chart} />
          </div>
          <div className="flex justify-end gap-1">
            <SortButton onClick={() => setSort(!sort)} sortAscending={sort} />
          </div>
        </div>
        <ScrollArea className="relative max-h-[328px]">
          <AllocationList projects={projects} sortAscending={sort} />
        </ScrollArea>
      </div>
    </Card>
  );
}
