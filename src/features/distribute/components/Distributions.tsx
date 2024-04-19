import { FileDown } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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
import { useProjectsById } from "~/features/projects/hooks/useProjects";
import { api } from "~/utils/api";
import { format } from "~/utils/csv";
import { usePoolAmount, usePoolToken } from "../hooks/useAlloPool";
import { type Address, formatUnits, parseUnits } from "viem";
import { cn } from "~/utils/classNames";
import { formatNumber } from "~/utils/formatNumber";
import { useMaci } from "~/contexts/Maci";

export function Distributions() {
  const [confirmDistribution, setConfirmDistribution] = useState<
    Distribution[]
  >([]);

  const { pollData } = useMaci();
  const votes = api.results.votes.useQuery({ pollId: pollData?.id.toString() });
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

          <div className="flex gap-2">
            <ExportCSV votes={distributions} />
            <Button variant="primary" type="submit">
              Distribute tokens
            </Button>
          </div>
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
  const { data: token } = usePoolToken();
  const { data: balance } = usePoolAmount();

  const { isPending, mutate } = useDistribute();

  const { recipients, amounts } = useMemo(() => {
    return distribution.reduce(
      (acc, x) => ({
        recipients: acc.recipients.concat(x.payoutAddress as Address),
        amounts: acc.amounts.concat(
          parseUnits(String(x.amount), token.decimals),
        ),
      }),
      { recipients: [], amounts: [] } as {
        recipients: Address[];
        amounts: bigint[];
      },
    );
  }, [distribution]);

  const amountDiff = (balance ?? 0n) - amounts.reduce((sum, x) => sum + x, 0n);

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

      <div className="mb-4 flex flex-col items-center">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
          <div>Pool balance after distribution</div>
        </h3>
        <div
          className={cn("text-2xl", {
            ["text-red-600"]: amountDiff < 0n,
          })}
        >
          {formatNumber(Number(formatUnits(amountDiff, token.decimals)))}
        </div>
      </div>
      <div className="space-y-1">
        <IconButton
          disabled={isPending || amountDiff < 0}
          icon={isPending ? Spinner : null}
          className={"w-full"}
          variant="primary"
          onClick={() =>
            mutate?.(
              { recipients, amounts },
              { onSuccess: () => onOpenChange() },
            )
          }
        >
          {isPending ? "Confirming..." : "Confirm"}
        </IconButton>
        <Button className={"w-full"} onClick={onOpenChange}>
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}

function ExportCSV({ votes }: { votes: Distribution[] }) {
  // Fetch projects for votes to get the name
  const projects = useProjectsById(votes.map((v) => v.projectId));

  const exportCSV = useCallback(async () => {
    // Append project name to votes
    const votesWithProjects = votes.map((vote) => ({
      ...vote,
      name: projects.data?.find((p) => p.id === vote.projectId)?.name,
    }));

    // Generate CSV file
    const csv = format(votesWithProjects, {
      columns: ["projectId", "name", "payoutAddress", "amount"],
    });
    window.open(`data:text/csv;charset=utf-8,${csv}`);
  }, [votes]);

  return (
    <IconButton
      type="button"
      icon={FileDown}
      disabled={projects.isLoading}
      onClick={exportCSV}
    >
      Export CSV
    </IconButton>
  );
}
