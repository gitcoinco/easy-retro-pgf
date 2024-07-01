"use client";

import { useMemo, useState } from "react";

import { MetricProject } from "~/utils/fetchMetrics";
import { useMetricById } from "~/features/metrics/hooks/useMetrics";
import { AvailableMetrics } from "~/features/metrics/types";
import { useCurrentMetricId } from "~/features/metrics/hooks/useMetrics";

import { AllocationList } from "./AllocationList";
import { SidebarWithChart } from "../SidebarWithChart";

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

export function MetricsSidebar() {
  const metricId = useCurrentMetricId();

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

  return (
    <SidebarWithChart
      title="Metric Data"
      description={AvailableMetrics[metricId]}
      chartData={chartData}
      sortOrder={sortOrder}
      toggleSortOrder={toggleSortOrder}
      isPending={isPending}
      error={error}
    >
      <AllocationList projects={sortedProjects} />
    </SidebarWithChart>
  );
}
