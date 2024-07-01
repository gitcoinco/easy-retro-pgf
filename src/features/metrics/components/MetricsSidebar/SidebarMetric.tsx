"use client";

import { useMemo, useState } from "react";
import { ArrowDownNarrowWide, ArrowUpWideNarrow } from "lucide-react";

import { Button } from "~/components/ui/Button";
import { ScrollArea } from "~/components/ui/ScrollArea";
import { MetricProject } from "~/utils/fetchMetrics";
import { useMetricById } from "~/features/metrics/hooks/useMetrics";
import { AvailableMetrics, MetricId } from "~/features/metrics/types";

import { AllocationList } from "./AllocationList";
import { CustomLineChart } from "../Charts";
import { SidebarCard } from "./SidebarCard";
import { Spinner } from "~/components/ui/Spinner";
import { SidebarPlaceholder } from "./SidebarPlaceholder";

type SidebarMetricProps = {
  metricId: MetricId;
};

const parseProjectsDataToChartData = (projects: MetricProject[]) => {
  return projects.map((project, index) => ({ x: index, y: project.fraction }));
};

const sortProjectsData = (
  projects: MetricProject[],
  sortBy: "ascending" | "descending",
) => {
  return projects.sort((a, b) =>
    sortBy === "descending" ? b.fraction - a.fraction : a.fraction - b.fraction,
  );
};

export function SidebarMetric({ metricId }: SidebarMetricProps) {
  const { data, error, isPending } = useMetricById(metricId);

  const projects = data?.projects || [];

  const [sortOrder, setSortOrder] = useState<"ascending" | "descending">(
    "descending",
  );

  const toggleSortOrder = () =>
    setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");

  const { sortedProjects, chartData } = useMemo(() => {
    const sortedProjects = sortProjectsData(projects, sortOrder);
    const chartData = parseProjectsDataToChartData(sortedProjects);
    return { sortedProjects, chartData };
  }, [projects, sortOrder]);

  if (isPending) {
    return (
      <SidebarPlaceholder title="Loading">
        <Spinner className="size-4" />
      </SidebarPlaceholder>
    );
  }

  if (error) {
    return (
      <SidebarPlaceholder title="Error" className="border-red-500">
        <p className="text-red-500">Error loading projects</p>
      </SidebarPlaceholder>
    );
  }

  return (
    <SidebarCard title="Metric Data" description={AvailableMetrics[metricId]}>
      <div className="space-y-2 p-3">
        <div className="space-y-1">
          <div className="h-32 rounded-lg border">
            <CustomLineChart data={chartData} />
          </div>
          <div className="flex justify-end gap-1">
            <Button
              size="xs"
              className="bg-transparent"
              onClick={toggleSortOrder}
            >
              {sortOrder === "ascending" ? "Ascending" : "Descending"}
              {sortOrder === "ascending" ? (
                <ArrowUpWideNarrow className="ml-1 size-4" />
              ) : (
                <ArrowDownNarrowWide className="ml-1 size-4" />
              )}
            </Button>
          </div>
        </div>
        <ScrollArea className="relative max-h-[328px]">
          <AllocationList projects={sortedProjects} />
        </ScrollArea>
      </div>
    </SidebarCard>
  );
}
