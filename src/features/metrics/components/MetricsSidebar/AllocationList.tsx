import { type MetricProject } from "~/utils/fetchMetrics";
import { AllocationItem } from "./AllocationItem";

const handleFormatAllocation = (p: number) => `${p * 100}%`;

export function AllocationList({ projects }: { projects: MetricProject[] }) {
  return (
    <>
      {projects.map((project) => (
        <AllocationItem key={project.id} {...project}>
          {handleFormatAllocation(project.amount)}
        </AllocationItem>
      ))}
    </>
  );
}
