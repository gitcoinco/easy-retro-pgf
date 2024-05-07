import { useFormContext } from "react-hook-form";
import { useAccount } from "wagmi";
import { Alert } from "~/components/ui/Alert";
import { Button } from "~/components/ui/Button";
import { Form, FormControl, Input, Label, Select } from "~/components/ui/Form";
import { Skeleton } from "~/components/ui/Skeleton";
import { Spinner } from "~/components/ui/Spinner";
import { config } from "~/config";
import ConfigurePool from "~/features/distribute/components/CreatePool";
import { Distributions } from "~/features/distribute/components/Distributions";
import {
  type Calculation,
  CalculationSchema,
} from "~/features/distribute/types";
import { Layout } from "~/layouts/DefaultLayout";
import { api } from "~/utils/api";

export default function DistributePage() {
  const utils = api.useUtils();
  const { address } = useAccount();

  const setConfig = api.config.set.useMutation({
    onSuccess: () => utils.results.votes.invalidate(),
  });
  const settings = api.config.get.useQuery();

  const calculation = settings.data?.config?.calculation;
  return (
    <Layout
      sidebar={address ? "left" : undefined}
      sidebarComponent={
        <div className="space-y-4">
          <ConfigurePool />
          {settings.isPending ? (
            <div />
          ) : (
            <Alert variant="info">
              <VoterCount />
              <div />

              <Form
                defaultValues={calculation}
                schema={CalculationSchema}
                onSubmit={(values) => {
                  setConfig.mutate({ config: { calculation: values } });
                }}
              >
                <div className="gap-2">
                  <FormControl name="style" label="Payout style">
                    <Select disabled={settings.isPending} className={"w-full"}>
                      <option value="custom">Custom</option>
                      <option value="op">OP-Style</option>
                    </Select>
                  </FormControl>
                  <MinimumQuorum />
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full"
                    disabled={setConfig.isPending}
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
      {address ? (
        <>
          {new Date() < config.reviewEndsAt ? (
            <div>Voting hasn't started yet</div>
          ) : (
            <div>
              {setConfig.isPending ? (
                <div className="flex justify-center py-8">
                  <Spinner className="size-6" />
                </div>
              ) : (
                <Distributions />
              )}
            </div>
          )}
        </>
      ) : (
        <Alert variant="info" title="Connect your wallet to continue"></Alert>
      )}
    </Layout>
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
  const voters = api.voters.list.useQuery({ limit: 1000 });
  const votes = api.results.votes.useQuery();

  return (
    <div className="mb-4 flex flex-col items-center">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
        Ballots submitted
      </h3>
      <div className="pt-1 text-center text-2xl">
        <Skeleton
          className="h-8 w-20 dark:bg-onSurfaceVariant-dark"
          isLoading={voters.isPending || votes.isPending}
        >
          {votes.data?.totalVoters} / {voters.data?.length}
        </Skeleton>
      </div>
    </div>
  );
}
