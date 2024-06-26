import { useMemo } from "react";
import { type MetricProject } from "~/utils/fetchMetrics";
import { AllocationItem } from "./AllocationItem";

const handleFormatAllocation = (p: number) => `${p * 100}%`;

export function AllocationList({
  projects,
  sortAscending,
}: {
  projects: MetricProject[];
  sortAscending: boolean;
}) {
  const projectsSortedByAmount = useMemo(
    () =>
      [...projects].sort((a, b) =>
        sortAscending ? a.amount - b.amount : b.amount - a.amount,
      ),
    [projects, sortAscending],
  );

  return (
    <>
      {projectsSortedByAmount.map((project) => (
        <AllocationItem key={project.id} {...project}>
          {handleFormatAllocation(project.amount)}
        </AllocationItem>
      ))}
    </>
  );
}
