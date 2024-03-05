import { useState } from "react";
import { z } from "zod";
import { EmptyState } from "~/components/EmptyState";
import { Button, IconButton } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import { Form } from "~/components/ui/Form";
import { Spinner } from "~/components/ui/Spinner";
import { Th, Thead, Tr } from "~/components/ui/Table";
import { DistributionForm } from "~/features/ballot/components/AllocationList";
import { useDistribute } from "~/features/distribute/hooks/useDistribute";
import {
  type Distribution,
  DistributionSchema,
} from "~/features/distribute/types";
import { api } from "~/utils/api";

export function Distributions() {
  const [confirmDistribution, setConfirmDistribution] = useState<
    Distribution[]
  >([]);
  const stats = api.results.stats.useQuery();
  const projectIds = Object.keys(stats.data?.projects ?? {});

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
  const distributions = projectIds
    .map((projectId) => ({
      projectId,
      payoutAddress:
        payoutAddresses[projectId as keyof typeof payoutAddresses] ?? "",
      amount: stats.data?.projects[projectId] ?? 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return distributions.length ? (
    <Form
      schema={z.object({
        votes: z.array(DistributionSchema),
      })}
      defaultValues={{ votes: distributions }}
      onSubmit={(values) => {
        console.log("Distribute", values.votes[0]);
        setConfirmDistribution(values.votes);
        // distribute.mutate(values.votes);
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h1 className="text-3xl font-bold">Distribute</h1>

        <Button variant="primary" type="submit">
          Distribute tokens
        </Button>
      </div>
      <div className="min-h-[360px] overflow-auto">
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
      <ConfirmDistributionDialog
        distribution={confirmDistribution}
        onOpenChange={() => setConfirmDistribution([])}
      />
    </Form>
  ) : (
    <div>
      <EmptyState title="No distribution found" />
    </div>
  );
}

function ConfirmDistributionDialog({
  distribution,
  onOpenChange,
}: {
  distribution: Distribution[];
  onOpenChange: () => void;
}) {
  const { isLoading, mutate } = useDistribute();

  return (
    <Dialog
      isOpen={distribution.length > 0}
      size="sm"
      title="Confirm distribution"
      onOpenChange={onOpenChange}
    >
      <div className="mb-4">
        This will distribute the pools funds to the payout addresses according
        to the table.
      </div>
      <div className="space-y-1">
        <IconButton
          disabled={isLoading}
          icon={isLoading ? Spinner : null}
          className={"w-full"}
          variant="primary"
          onClick={() => mutate(distribution)}
        >
          {isLoading ? "Confirming..." : "Confirm"}
        </IconButton>
        <Button className={"w-full"} onClick={onOpenChange}>
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}
