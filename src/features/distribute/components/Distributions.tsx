import { z } from "zod";
import { EmptyState } from "~/components/EmptyState";
import { Button } from "~/components/ui/Button";
import { Form } from "~/components/ui/Form";
import { Spinner } from "~/components/ui/Spinner";
import { Th, Thead, Tr } from "~/components/ui/Table";
import { DistributionForm } from "~/features/ballot/components/AllocationList";
import { useDistribute } from "~/features/distribute/hooks/useDistribute";
import { DistributionSchema } from "~/features/distribute/types";
import { api } from "~/utils/api";

export function Distributions() {
  const stats = api.results.stats.useQuery();
  const projectIds = Object.keys(stats.data?.projects ?? {});

  const distribute = useDistribute();
  const projects = api.projects.payoutAddresses.useQuery(
    { ids: projectIds },
    { enabled: Boolean(projectIds.length) },
  );

  const payoutAddresses = projects.data ?? {};

  if (projects.isLoading ?? stats.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }
  const distributions = projectIds.map((projectId) => ({
    projectId,
    payoutAddress:
      payoutAddresses[projectId as keyof typeof payoutAddresses] ?? "",
    amount: stats.data?.projects[projectId],
  }));

  return distributions.length ? (
    <Form
      schema={z.object({
        votes: z.array(DistributionSchema),
      })}
      defaultValues={{ votes: distributions }}
      onSubmit={(values) => {
        console.log("Distribute", values.votes[0]);

        distribute.mutate(values.votes);
      }}
    >
      <div className="mb-2 flex justify-end">
        <Button variant="primary" type="submit">
          Distribute tokens
        </Button>
      </div>
      <div className="max-h-[500px] min-h-[360px] overflow-auto">
        <DistributionForm
          renderHeader={() => (
            <Thead>
              <Tr>
                <Th>Project</Th>
                <Th>Payout address</Th>
                <Th>Amount</Th>
              </Tr>
            </Thead>
          )}
        />
      </div>
    </Form>
  ) : (
    <div>
      <EmptyState title="No distribution found" />
    </div>
  );
}
