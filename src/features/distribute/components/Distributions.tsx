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

  console.log("distributionResult", distributionResult);

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
      <div className="my-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <ExportVotes totalVotes={formatNumber(totalVotes)} />
          <ImportCSV onImport={setImportedDistribution} />
          <ExportCSV votes={distributions} />
        </div>
        <Button
          variant="primary"
          onClick={() => setConfirmDistribution(distributions)}
        >
          Distribute tokens
        </Button>
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payout Address
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount Percentage
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {distributions?.map((distribution) => (
            <tr key={distribution.projectId}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {distribution.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {distribution.payoutAddress}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {distribution.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {distribution.amountPercentage?.toFixed(2)} %
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExportVotes(props:{
  totalVotes: string
}) {
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
