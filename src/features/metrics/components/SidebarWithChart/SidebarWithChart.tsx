"use client";

import { PropsWithChildren } from "react";
import { ArrowDownNarrowWide, ArrowUpWideNarrow } from "lucide-react";

import { Button } from "~/components/ui/Button";
import { ScrollArea } from "~/components/ui/ScrollArea";
import { Spinner } from "~/components/ui/Spinner";

import { CustomLineChart } from "../Charts";
import { SidebarCard } from "./SidebarCard";
import { SidebarPlaceholder } from "./SidebarPlaceholder";

export type SortOrder = "ascending" | "descending";

type SidebarWithChartProps = PropsWithChildren<{
  title?: string;
  description?: string;
  chartData: {
    x: number;
    y: number;
  }[];
  sortOrder: SortOrder;
  toggleSortOrder: () => void;
  isPending?: boolean;
  error: any;
}>;

export function SidebarWithChart({
  children,
  title = "",
  description = "",
  chartData,
  sortOrder,
  toggleSortOrder,
  isPending,
  error,
}: SidebarWithChartProps) {
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
        <ScrollArea className="relative max-h-[328px]">{children} </ScrollArea>
      </div>
    </SidebarCard>
  );
}
