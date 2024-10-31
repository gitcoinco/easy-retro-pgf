import { z } from "zod";
import { Alert } from "~/components/ui/Alert";
import { Button } from "~/components/ui/Button";
import { Form, FormControl, Input, Select } from "~/components/ui/Form";
import { Skeleton } from "~/components/ui/Skeleton";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";
import {
  CalculationTypeSchema,
  calculationTypes,
} from "~/features/rounds/types";
import { useVoters } from "~/features/voters/hooks/useApproveVoters";

export const CalculationSchema = z.object({
  calculationType: CalculationTypeSchema,
  threshold: z.number().optional(),
});

export type Calculation = z.infer<typeof CalculationSchema>;

export function CalculationForm({
  isLoading,
  onUpdate,
}: {
  isLoading?: boolean;
  onUpdate: (values: Calculation) => void;
}) {
  const round = useCurrentRound();

  const { calculationConfig = {}, calculationType } = round.data ?? {};

  const defaultValues = {
    calculationType,
    ...(calculationConfig as Record<string, unknown>),
  } as Calculation;

  return (
    <Alert variant="info">
      <VoterCount />
      <div />

      <Form
        defaultValues={defaultValues}
        schema={CalculationSchema}
        onSubmit={(values) => onUpdate(values)}
      >
        <div className="gap-2">
          <FormControl name="calculationType" label="Payout style">
            <Select disabled={round.isPending} className={"w-full"}>
              {Object.entries(calculationTypes).map(([type, label]) => (
                <option value={type} key={type}>
                  {label}
                </option>
              ))}
            </Select>
          </FormControl>
          <MinimumQuorum />
          <Button
            variant="primary"
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            Update calculation
          </Button>
        </div>
      </Form>
    </Alert>
  );
}
function MinimumQuorum() {
  return (
    <FormControl
      name="threshold"
      label="Minimum Quorum"
      hint="Required voters for vote validity"
      valueAsNumber
    >
      <Input type="number" />
    </FormControl>
  );
}

function VoterCount() {
  const voters = useVoters();
  const votes = api.results.votes.useQuery();

  return (
    <div className="mb-4 flex flex-col items-center">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
        Ballots submitted
      </h3>
      <div className="pt-1 text-center text-2xl">
        <Skeleton
          className="h-8 w-20"
          isLoading={voters.isPending || votes.isPending}
        >
          {votes.data?.totalVoters} / {voters.data?.length}
        </Skeleton>
      </div>
    </div>
  );
}
