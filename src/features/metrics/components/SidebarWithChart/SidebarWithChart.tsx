"use client";

import { PropsWithChildren, useMemo, useState } from "react";
import { ArrowDownNarrowWide, ArrowUpWideNarrow } from "lucide-react";

import { Button } from "~/components/ui/Button";
import { ScrollArea } from "~/components/ui/ScrollArea";
import { Spinner } from "~/components/ui/Spinner";

import { CustomLineChart } from "../Charts";
import { SidebarCard } from "./SidebarCard";
import { SidebarPlaceholder } from "./SidebarPlaceholder";
import { AllocationList } from "./AllocationList";

export type SortOrder = "ascending" | "descending";

const sortAllocationData = (
  allocationData: {
    id: string;
    name?: string;
    image?: string;
    amount: number;
    fraction: number;
  }[],
  sortBy: "ascending" | "descending",
) => {
  return allocationData.sort((a, b) =>
    sortBy === "descending" ? b.fraction - a.fraction : a.fraction - b.fraction,
  );
};

const parseAllocationDataToChartData = (
  allocationData: {
    id: string;
    name?: string;
    image?: string;
    amount: number;
    fraction: number;
  }[],
) => {
  return allocationData.map((item, index) => ({
    x: index,
    y: item.fraction,
  }));
};

type SidebarWithChartProps = {
  title?: string;
  description?: string;
  allocationData: {
    id: string;
    name?: string;
    image?: string;
    amount: number;
    fraction: number;
  }[];
  isPending?: boolean;
  error: any;
};

export function SidebarWithChart({
  title = "",
  description = "",
  allocationData,
  isPending,
  error,
}: SidebarWithChartProps) {
  const [sortOrder, setSortOrder] = useState<"ascending" | "descending">(
    "descending",
  );

  const toggleSortOrder = () =>
    setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");

  const { sortedData, chartData } = useMemo(() => {
    const sortedData = sortAllocationData(allocationData, sortOrder);
    const chartData = parseAllocationDataToChartData(sortedData);
    return { sortedData, chartData };
  }, [allocationData, sortOrder]);

  if (isPending) {
    return (
      <SidebarPlaceholder>
        <Spinner className="size-4" />
      </SidebarPlaceholder>
    );
  }

  if (error) {
    return (
      <SidebarPlaceholder className="border-red-500">
        <p className="text-red-500">Error loading data</p>
      </SidebarPlaceholder>
    );
  }

  return (
    <SidebarCard title={title} description={description}>
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
          <AllocationList data={sortedData} />
        </ScrollArea>
      </div>
    </SidebarCard>
  );
}
