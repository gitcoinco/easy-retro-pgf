import { useCallback, useState } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/Button";
import { Form, FormControl, Input, Label, Select } from "~/components/ui/Form";
import { Skeleton } from "~/components/ui/Skeleton";
import { Spinner } from "~/components/ui/Spinner";
import { config } from "~/config";
import ConfigurePool from "~/features/distribute/components/CreatePool";
import { Distributions } from "~/features/distribute/components/Distributions";
import { CalculationSchema } from "~/features/distribute/types";
import { Layout } from "~/layouts/DefaultLayout";
import { api } from "~/utils/api";

export default function DistributePage() {
  const utils = api.useUtils();
  const setConfig = api.config.set.useMutation({
    onMutate: async (data) => {
      // Optimistic update
      utils.config.get.setData(undefined, (prev) => ({
        id: prev?.id ?? "?",
        ...data,
      }));
    },
    // Trigger re-fetch of votes (with new calculation settings)
    onSuccess: () => utils.results.votes.invalidate(),
  });
  const settings = api.config.get.useQuery();

  const calculation = settings.data?.config?.calculation;

  return (
    <Layout sidebar="left" sidebarComponent={<ConfigurePool />}>
      {new Date() < config.reviewEndsAt ? (
        <div>Voting hasn't started yet</div>
      ) : (
        <div>
          <div className="mb-2 flex justify-between gap-2">
            <VoterCount />
            {settings.isLoading ? (
              <div className="h-[86px] w-[394px] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            ) : (
              <Form
                defaultValues={calculation}
                schema={CalculationSchema}
                onSubmit={(values) => {
                  console.log("values", values);
                  setConfig.mutate({ config: { calculation: values } });
                }}
              >
                <div className="flex gap-2">
                  <FormControl name="style" label="Payout style">
                    <Select disabled={settings.isLoading} className={"w-full"}>
                      <option value="custom">Custom</option>
                      <option value="op">OP-Style</option>
                    </Select>
                  </FormControl>

                  <FormControl
                    name="threshold"
                    label="Minimum Quorum"
                    valueAsNumber
                  >
                    <Input type="number" className="block w-44" />
                  </FormControl>
                  <div className="pt-7">
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      disabled={setConfig.isLoading}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </div>
          {setConfig.isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : (
            <Distributions />
          )}
        </div>
      )}
    </Layout>
  );
}

function VoterCount() {
  const voters = api.voters.list.useQuery({ limit: 1000 });
  const votes = api.results.votes.useQuery();

  return (
    <div>
      <Label>How many have voted?</Label>
      <div className="pt-1 text-center text-2xl font-semibold">
        <Skeleton
          className="h-8 w-20"
          isLoading={voters.isLoading || votes.isLoading}
        >
          {votes.data?.totalVoters} / {voters.data?.length}
        </Skeleton>
      </div>
    </div>
  );
}
