import { type MetricProject } from "~/utils/fetchMetrics";
import { AllocationItem } from "./AllocationItem";

const formatAllocationPercentage = (amount: number) => `${amount * 100}%`;

type AllocationListProps = {
  projects: MetricProject[];
};

export function AllocationList({ projects }: AllocationListProps) {
  return (
    <>
      {projects.map((project) => (
        <AllocationItem key={project.id} {...project}>
          {formatAllocationPercentage(project.fraction)}
        </AllocationItem>
      ))}
    </>
  );
}
