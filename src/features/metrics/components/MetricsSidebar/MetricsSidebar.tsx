"use client";
import { useMemo, useState } from "react";

import { Card } from "~/components/ui/Card";
import { Heading } from "~/components/ui/Heading";
import { ScrollArea } from "~/components/ui/ScrollArea";
import { Button } from "../Buttons";
import { AllocationList } from "./AllocationList";
import { MetricProject } from "~/utils/fetchMetrics";
import { CustomLineChart } from "../Charts";
import { ArrowDownNarrowWide, ArrowUpWideNarrow } from "lucide-react";

type MetricsSidebarProps = {
  projects: MetricProject[];
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

const title = "Distribution";
const description = "For this particular metric";

export function MetricsSidebar({ projects }: MetricsSidebarProps) {
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
    <Card className="sticky top-4 w-[300px]">
      <div className="p-3">
        <Heading size="xl">{title}</Heading>
        {description && <p className="mb-4 leading-relaxed">{description}</p>}
      </div>
      <div className="space-y-2 p-3">
        <div className="space-y-1">
          <div className="h-32 rounded-lg border">
            <CustomLineChart data={chartData} />
          </div>
          <div className="flex justify-end gap-1">
            <Button
              size="xs"
              iconRight={
                sortOrder === "ascending"
                  ? ArrowUpWideNarrow
                  : ArrowDownNarrowWide
              }
              onClick={toggleSortOrder}
            >
              {sortOrder === "ascending" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </div>
        <ScrollArea className="relative max-h-[328px]">
          <AllocationList projects={sortedProjects} />
        </ScrollArea>
      </div>
    </Card>
  );
}
