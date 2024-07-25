import { useCallback, useState } from "react";
import { z } from "zod";

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
import { formatNumber } from "~/utils/formatNumber";
import { format } from "~/utils/csv";
import { ImportCSV } from "./ImportCSV";

export function Distributions() {
  const [importedDistribution, setImportedDistribution] = useState<
    Distribution[]
  >([]);
  const [confirmDistribution, setConfirmDistribution] = useState<
    Distribution[]
  >([]);
  const poolAmount = usePoolAmount();
  const totalTokens = poolAmount.data?.toString() ?? "0";
  const distributionResult = api.results.distribution.useQuery({
    totalTokens,
  });
  console.log(distributionResult.data);

  if (distributionResult.isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  const distributions = importedDistribution.length
    ? importedDistribution
    : distributionResult.data?.distributions || [];
  const projectIds = distributionResult.data?.projectIds || [];
  const totalVotes = distributionResult.data?.totalVotes;

  if (!projectIds.length) {
    return <EmptyState title="No project votes found" />;
  }

  if (!distributions.length) {
    return <EmptyState title="No distribution found" />;
  }

  console.log(JSON.stringify(distributionResult.data, null, 2));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h1 className="text-3xl font-bold">Distribute</h1>

        <div className="flex items-center gap-2">
          <ImportCSV onImport={setImportedDistribution} />
          <ExportCSV votes={distributions} />
          <Button
            variant="primary"
            onClick={() => setConfirmDistribution(distributions)}
          >
            Distribute tokens
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>Total votes: {formatNumber(totalVotes)}</div>
        <ExportVotes />
      </div>
      <div className="min-h-[360px] overflow-auto">
        <DistributionTable distributions={distributions} />
      </div>
      <ConfirmDistributionDialog
        distribution={confirmDistribution}
        onOpenChange={() => setConfirmDistribution([])}
      />
    </div>
  );
}

function DistributionTable({
  distributions,
}: {
  distributions: Distribution[];
}) {
  return (
    <div className="space-y-2 divide-y">
      {distributions?.map((distribution) => (
        <div key={distribution.projectId} className="flex items-center pt-3">
          <div className="flex-1">
            <div className="font-semibold">{distribution.name}</div>
            <div className="font-mono text-sm">
              {distribution.payoutAddress}
            </div>
          </div>
          <div className="items-center">
            {formatNumber(distribution.amount)}
          </div>
        </div>
      ))}
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
        "id",
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
