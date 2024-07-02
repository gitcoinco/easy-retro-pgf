import {
  useBallot,
  useRemoveAllocation,
  useSaveAllocation,
} from "~/features/ballotV2/hooks/useBallot";
import { MetricsLayout } from "~/layouts/MetricsLayout";
import { NumericFormat } from "react-number-format";
import { Allocation } from "@prisma/client";
import { Button } from "~/components/ui/Button";
import { Trash } from "lucide-react";

function BallotEditor({ allocations = [] }: { allocations?: Allocation[] }) {
  const save = useSaveAllocation();
  const remove = useRemoveAllocation();
  return (
    <div className="rounded border p-4">
      {allocations.map(({ id, amount }) => (
        <div key={id} className="flex items-center justify-between">
          <div className="flex-1">{id}</div>
          <div className="flex gap-2">
            <NumericFormat
              className="w-16 rounded text-center"
              max={100}
              min={0}
              isAllowed={({ floatValue = 0 }) =>
                floatValue >= 0 && floatValue <= 100
              }
              allowNegative={false}
              allowLeadingZeros={false}
              suffix={"%"}
              defaultValue={+amount}
              onValueChange={({ floatValue = 0 }) => {
                console.log(floatValue);
                save.mutate({ id, amount: floatValue, locked: false });
              }}
            />
            <Button icon={Trash} onClick={() => remove.mutate({ id })} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MetricsBallot() {
  const { data: ballot } = useBallot();

  console.log("ballot", ballot);
  return (
    <MetricsLayout>
      <BallotEditor allocations={ballot?.allocations} />
    </MetricsLayout>
  );
}
