import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import { formatUnits } from "viem";

import { EmptyState } from "~/components/EmptyState";
import { Button } from "~/components/ui/Button";
import { Form } from "~/components/ui/Form";
import { Spinner } from "~/components/ui/Spinner";
import { Th, Thead, Tr } from "~/components/ui/Table";
import { DistributionForm } from "~/components/AllocationList";
import {
  type Distribution,
  DistributionSchema,
} from "~/features/distribute/types";
import { api } from "~/utils/api";
import { usePoolAmount } from "../hooks/useAlloPool";
import { ConfirmDistributionDialog } from "./ConfirmDistributionDialog";
import { ExportCSV } from "./ExportCSV";
import { calculatePayout } from "../utils/calculatePayout";
import { formatNumber } from "~/utils/formatNumber";
import { format } from "~/utils/csv";
import { ImportCSV } from "./ImportCSV";

export function Distributions() {
  const [confirmDistribution, setConfirmDistribution] = useState<
    Distribution[]
  >([]);

  const poolAmount = usePoolAmount();
  const votes = api.results.votes.useQuery();
  const projectIds = Object.keys(votes.data?.projects ?? {});

  const projects = api.projects.payoutAddresses.useQuery(
    { ids: projectIds },
    { enabled: Boolean(projectIds.length) },
  );

  const payoutAddresses: Record<string, string> = projects.data ?? {};
  const totalVotes = BigInt(votes.data?.totalVotes ?? 0);
  const totalTokens = poolAmount.data ?? 0n;
  const projectVotes = votes.data?.projects ?? {};
  const distributions = useMemo(
    () =>
      projectIds
        ?.map((projectId) => ({
          projectId,
          payoutAddress: payoutAddresses[projectId] ?? "",
          amount: projectVotes[projectId]?.votes ?? 0,
        }))
        .filter((p) => p.amount > 0)
        .sort((a, b) => b.amount - a.amount)
        .map((p) => ({
          ...p,
          amount:
            totalTokens > 0n
              ? parseFloat(
                  formatUnits(
                    calculatePayout(p.amount, totalVotes, totalTokens),
                    18,
                  ),
                )
              : p.amount,
        })),
    [projectIds, payoutAddresses, projectVotes, totalVotes, totalTokens],
  );

  if (!votes.isPending && !projectIds.length) {
    return <EmptyState title="No project votes found" />;
  }
  if (projects.isPending ?? votes.isPending ?? poolAmount.isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

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

          <div className="flex items-center gap-2">
            <ImportCSV />
            <ExportCSV votes={distributions} />
            <Button variant="primary" type="submit">
              Distribute tokens
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>Total votes: {formatNumber(votes.data?.totalVotes)}</div>
          <ExportVotes />
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

function ExportVotes() {
  const { mutateAsync, isPending } = api.ballot.export.useMutation();
  const exportCSV = useCallback(async () => {
    const ballots = await mutateAsync();
    // Generate CSV file
    const csv = format(ballots, {
      columns: [
        "voterId",
        "signature",
        "publishedAt",
        "project",
        "amount",
        "projectId",
      ],
    });
    window.open(`data:text/csv;charset=utf-8,${csv}`);
  }, [mutateAsync]);

  return (
    <Button variant="outline" isLoading={isPending} onClick={exportCSV}>
      Download votes
    </Button>
  );
}
