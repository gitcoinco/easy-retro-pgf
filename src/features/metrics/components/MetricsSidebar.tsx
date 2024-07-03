"use client";
import { PropsWithChildren, ReactNode, useMemo, useRef, useState } from "react";

import AvatarPlaceholder from "../../../../public/avatarPlaceholder.svg";
import { useIntersection } from "react-use";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/Tooltip";
import { Skeleton } from "~/components/ui/Skeleton";
import {
  ArrowDown,
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  ChevronRight,
  SquareCode,
} from "lucide-react";
import { Button } from "~/components/ui/Button";
import { Separator } from "~/components/ui/Separator";
import { Heading } from "~/components/ui/Heading";
import { Allocation } from "~/features/ballot/types";
import { ScrollArea } from "~/components/ui/ScrollArea";
import { Badge } from "~/components/ui/Badge";
import { cn } from "~/utils/classNames";
import { api } from "~/utils/api";
import MetricDistributionChart from "./MetricDistributionChart";

type ProjectAllocation = {
  name: string;
  image?: string;
  amount: number;
  fraction: number;
  metrics: Allocation[];
};
export function MetricsSidebar({
  title,
  description,
  isLoading,
  isUpdating,
  projects,
  footer,
  formatAllocation = (v: number) => v,
  formatChartTick = (v: number) => String(v),
}: {
  title: string;
  description?: string;
  isLoading?: boolean;
  isUpdating?: boolean;
  footer?: ReactNode;
  formatAllocation: (alloc: number) => string | number;
  formatChartTick: (alloc: number) => string;
  projects: ProjectAllocation[];
}) {
  const [sort, setSort] = useState(false);

  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  const list = useMemo(
    () =>
      (projects ?? []).sort((a, b) =>
        a.amount < b.amount ? (sort ? -1 : 1) : -1,
      ),
    [projects, sort],
  );

  const chart = useMemo(
    () =>
      (projects ?? [])
        .map((project, i) => ({ x: i, y: project.amount }))
        .sort((a, b) => (a.y < b.y ? (sort ? -1 : 1) : -1)),
    [projects, sort],
  );

  return (
    <div
      className={cn("sticky top-4 w-[300px]", {
        ["animate-pulse opacity-50"]: isUpdating,
      })}
    >
      <div className="p-3">
        <Heading variant="h3">{title}</Heading>
        {description && <div>{description}</div>}
      </div>
      <div className="space-y-2 p-3">
        <div className="space-y-1">
          <TooltipProvider>
            <Tooltip delayDuration={isLoading ? 0 : 1000000}>
              <TooltipTrigger asChild>
                <div className="h-32 rounded-lg border">
                  <MetricDistributionChart
                    data={chart}
                    formatChartTick={formatChartTick}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="max-w-[300px] text-center text-xs"
                // align={"center"}
                sideOffset={-60}
              >
                <p>
                  First add metrics to your ballot, then you&apos;ll be able to
                  see your OP allocation
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex justify-end gap-1">
            <MetricSort sort={sort} setSort={setSort} />
          </div>
        </div>
        <ScrollArea className="relative h-[328px]">
          {isLoading &&
            Array(8)
              .fill(0)
              .map((_, i) => (
                <AllocationItem key={i} isLoading>
                  --
                </AllocationItem>
              ))}
          {list.map((item) => (
            <AllocationItem key={item.name} {...item}>
              {formatAllocation(item.amount)}
            </AllocationItem>
          ))}
          <div ref={intersectionRef} />
          {(intersection?.intersectionRatio ?? 0) < 1 && (
            <Badge
              variant="outline"
              className="animate-in fade-in zoom-in absolute bottom-2 left-1/2 -translate-x-1/2 bg-white"
            >
              More <ArrowDown className="ml-2 size-3 " />
            </Badge>
          )}
        </ScrollArea>

        {footer}
      </div>
    </div>
  );
}
function MetricPopover({
  is_os,
  list,
  onOpenManual,
}: {
  is_os: boolean;
  list?: Allocation[];
  onOpenManual: () => void;
}) {
  if (!list?.length) return null;
  return (
    <div className="text-xs">
      <h3 className="text-muted-foreground p-1 font-semibold">
        Top ranked from your ballot
      </h3>
      <ol>
        {list?.map((m, i) => (
          <li key={m.id} className="flex gap-2 p-2">
            <div>{i + 1}.</div>
            <MetricNameFromId id={m.id} />
          </li>
        ))}
      </ol>
      {is_os && (
        <>
          <Separator className="-mx-3 mb-2" />
          <Button
            icon={SquareCode}
            variant={"ghost"}
            size="sm"
            iconRight={ChevronRight}
            onClick={onOpenManual}
          >
            This project is open source
          </Button>
        </>
      )}
    </div>
  );
}

function AllocationItem({
  name,
  image = AvatarPlaceholder.src,
  metrics,
  is_os,
  isLoading,
  children,
}: PropsWithChildren<Partial<ProjectAllocation>> & { isLoading?: boolean }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <TooltipProvider delayDuration={metrics?.length ? 500 : 1000000}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-muted-foreground flex flex-1 items-center justify-between border-b py-2 text-xs">
              <div className="flex max-w-[204px] items-center gap-2 ">
                <div
                  className="size-6 flex-shrink-0 rounded-lg bg-gray-100 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${image})`,
                  }}
                />
                <div className="truncate">
                  {name || <Skeleton className="h-3 w-16" />}
                </div>
                {is_os && <SquareCode className="mr-1 size-3 flex-shrink-0" />}
              </div>
              <div className={cn({ ["text-gray-400"]: isLoading })}>
                {children}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="max-w-[300px]"
            align="end"
            alignOffset={-14}
          >
            <MetricPopover
              is_os={is_os}
              list={metrics}
              onOpenManual={() => setOpen(true)}
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

export function MetricSort({
  sort,
  setSort,
}: {
  sort: boolean;
  setSort: (bool: boolean) => void;
}) {
  const icon = sort ? ArrowUpWideNarrow : ArrowDownNarrowWide;
  const title = sort ? "Ascending" : "Descending";
  return (
    <Button
      onClick={() => setSort(!sort)}
      className="w-2/5"
      iconRight={icon}
      variant="ghost"
      size="xs"
    >
      {title}
    </Button>
  );
}

export function MetricNameFromId({ id = "" }) {
  const { data, isPending } = api.metrics.get.useQuery({ ids: [id] });
  console.log("name", data);
  return (
    <span className={cn("truncate", { ["animate-pulse"]: isPending })}>
      {Object.values(data ?? {})[0] ?? id}
    </span>
  );
}
