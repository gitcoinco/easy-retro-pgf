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

  const votes = api.results.votes.useQuery();
  const projectIds = Object.keys(votes.data?.projects ?? {});

  const projects = api.projects.payoutAddresses.useQuery(
    { ids: projectIds },
    { enabled: Boolean(projectIds.length) },
  );

  const payoutAddresses = projects.data ?? {};

  if (!votes.isLoading && !projectIds.length) {
    return (
      <EmptyState title="No project votes found (try changing Minimum Qurom)" />
    );
  }
  if (projects.isLoading ?? votes.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }
  const distributions = projectIds
    .map((projectId) => ({
      projectId,
      payoutAddress:
        payoutAddresses[projectId as keyof typeof payoutAddresses] ?? "",
      amount: votes.data?.projects?.[projectId]?.votes ?? 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  if (!distributions.length) {
    return <EmptyState title="No distribution found" />;
  }

  return (
    <div>
      <Form
        schema={z.object({
          votes: z.array(DistributionSchema),
        })}
        values={{ votes: distributions }}
        onSubmit={(values) => {
          console.log("Distribute", values.votes[0]);
          setConfirmDistribution(values.votes);
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
          onClick={() => alert("not implemented yet")}
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
