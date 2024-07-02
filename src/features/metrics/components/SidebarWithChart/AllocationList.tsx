import { AllocationItem } from "./AllocationItem";

const formatAllocationPercentage = (amount: number) => `${amount * 100}%`;

type AllocationListProps = {
  data: {
    id: string;
    name?: string;
    image?: string;
    amount: number;
    fraction: number;
  }[];
};

export function AllocationList({ data }: AllocationListProps) {
  return (
    <>
      {data.map((item) => (
        <AllocationItem key={item.id} {...item}>
          {formatAllocationPercentage(item.fraction)}
        </AllocationItem>
      ))}
    </>
  );
}
