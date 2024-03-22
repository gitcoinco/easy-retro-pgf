import { useFormContext } from "react-hook-form";
import { Alert } from "~/components/ui/Alert";
import { Button } from "~/components/ui/Button";
import { Form, FormControl, Input, Select } from "~/components/ui/Form";
import { Skeleton } from "~/components/ui/Skeleton";
import { Spinner } from "~/components/ui/Spinner";
import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";
import ConfigurePool from "~/features/distribute/components/CreatePool";
import { Distributions } from "~/features/distribute/components/Distributions";
import {
  type Calculation,
  CalculationSchema,
} from "~/features/distribute/types";
import {
  useCurrentRound,
  useUpdateRound,
} from "~/features/rounds/hooks/useRound";
import { useVoters } from "~/features/voters/hooks/useApproveVoters";
import { api } from "~/utils/api";

export default function DistributePage() {
  const utils = api.useUtils();
  const round = useCurrentRound();
  const update = useUpdateRound();

  const calculation = round.data?.calculation as Calculation;

  return (
    <RoundAdminLayout
      sidebarComponent={
        <div className="space-y-4">
          <ConfigurePool />
          {round.isLoading ? (
            <div />
          ) : (
            <Alert variant="info">
              <VoterCount />
              <div />

              <Form
                defaultValues={calculation}
                schema={CalculationSchema}
                onSubmit={(values) => {
                  update.mutate(
                    { calculation: values },
                    {
                      async onSuccess() {
                        return utils.results.votes.invalidate();
                      },
                    },
                  );
                }}
              >
                <div className="gap-2">
                  <FormControl name="style" label="Payout style">
                    <Select disabled={round.isLoading} className={"w-full"}>
                      <option value="custom">Custom</option>
                      <option value="op">OP-Style</option>
                    </Select>
                  </FormControl>
                  <MinimumQuorum />
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full"
                    disabled={update.isLoading}
                  >
                    Update calculation
                  </Button>
                </div>
              </Form>
            </Alert>
          )}
        </div>
      }
    >
      {() =>
        new Date() < (round.data?.reviewEndsAt ?? new Date()) ? (
          <div>Voting hasn't started yet</div>
        ) : (
          <div className="max-w-screen-md">
            {update.isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner className="size-6" />
              </div>
            ) : (
              <Distributions />
            )}
          </div>
        )
      }
    </RoundAdminLayout>
  );
}

function MinimumQuorum() {
  const { watch } = useFormContext<Calculation>();
  const style = watch("style");

  return (
    <FormControl
      name="threshold"
      label="Minimum Quorum"
      hint="Only for OP-style payouts"
      valueAsNumber
    >
      <Input type="number" disabled={style !== "op"} />
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
          className="h-8 w-20 dark:bg-gray-700"
          isLoading={voters.isLoading || votes.isLoading}
        >
          {votes.data?.totalVoters} / {voters.data?.length}
        </Skeleton>
      </div>
    </div>
  );
}
