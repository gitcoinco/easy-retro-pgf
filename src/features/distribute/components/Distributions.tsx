import { useCallback, useState } from "react";
import { EmptyState } from "~/components/EmptyState";
import { Button } from "~/components/ui/Button";
import { Spinner } from "~/components/ui/Spinner";
import { EyeIcon, ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react";
import {
  type Distribution,
  type PayoutsTableProps,
  type MainTableProps,
} from "~/features/distribute/types";
import { api } from "~/utils/api";
import { ConfirmDistributionDialog } from "./ConfirmDistributionDialog";
import { ExportCSV } from "./ExportCSV";
import { formatNumber } from "~/utils/formatNumber";
import { format } from "~/utils/csv";
import { ImportCSV } from "./ImportCSV";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import React from "react";
import { useDistributeInfo } from "../hooks/useDistributeInfo";

export function Distributions() {
  const [importedDistribution, setImportedDistribution] = useState<
    Distribution[]
  >([]);
  const [confirmDistribution, setConfirmDistribution] = useState<
    Distribution[]
  >([]);

  const info = useDistributeInfo();
  const { data, isFetched } = info;

  const payoutEventsByTransaction = data?.payoutEventsByTransaction;
  const distributionResult = data?.distributionResult.data;
  const poolAmount = data?.poolAmount;
  const token = data?.token.data;
  const explorerUrl = data?.explorerLink;

  const projectIds = distributionResult?.projectIds || [];
  const totalVotes = distributionResult?.totalVotes || 0;
  const totalTokens = poolAmount?.toString() ?? "0";
  const distributions = importedDistribution.length
    ? importedDistribution.map((d) => ({
        ...d,
        amount:
          (((d.amountPercentage || 0) / 100) * Number(totalTokens)) /
          10 ** (token?.decimals ?? 1e18),
      }))
    : distributionResult?.distributions || [];

  if (!isFetched) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (projectIds.length === 0) {
    return <EmptyState title="No project votes found" />;
  }

  if (distributions.length === 0) {
    return <EmptyState title="No distribution found" />;
  }

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

      {isFetched && (
        <div className="min-h-[360px] overflow-auto">
          <PayoutsTable
            payoutEventsByTransaction={payoutEventsByTransaction || {}}
            explorerUrl={explorerUrl || ""}
          />
        </div>
      )}
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
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Project Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Payout Address
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Amount Percentage
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {distributions?.map((distribution) => (
            <tr key={distribution.projectId}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {distribution.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {distribution.payoutAddress}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {distribution.amount}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {distribution.amountPercentage?.toFixed(2)} %
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PayoutsTable({
  payoutEventsByTransaction,
  explorerUrl,
}: MainTableProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const handleRowClick = (transactionHash: string) => {
    if (expandedRows.includes(transactionHash)) {
      setExpandedRows(expandedRows.filter((hash) => hash !== transactionHash));
    } else {
      setExpandedRows([...expandedRows, transactionHash]);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 text-lg font-semibold">Completed Payouts</div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 ">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 "
            >
              Payout ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Transaction Hash
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              View
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-green-100">
          {Object.keys(payoutEventsByTransaction).map(
            (transactionHash, index) => (
              <React.Fragment key={transactionHash}>
                <tr
                  onClick={() => handleRowClick(transactionHash)}
                  className="cursor-pointer"
                >
                  <td className="whitespace-nowrap border-y border-l border-black px-6 py-4 text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap border-y border-black px-6 py-4 text-sm text-gray-500">
                    {transactionHash}
                  </td>
                  <td className="whitespace-nowrap border-y border-r border-black px-6 py-4 text-sm text-blue-500 ">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`${explorerUrl}/tx/${transactionHash}`} // Replace with appropriate link structure
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1"
                        onClick={(e) => e.stopPropagation()} // Prevent triggering row expansion on click
                      >
                        <EyeIcon color="black" className="ml-2" />
                      </a>
                      {expandedRows.includes(transactionHash) ? (
                        <ArrowBigUpIcon color="black" />
                      ) : (
                        <ArrowBigDownIcon color="black" />
                      )}
                    </div>
                  </td>
                </tr>
                {expandedRows.includes(transactionHash) && (
                  <tr>
                    <td colSpan={3}>
                      <InnerTable
                        distributions={
                          payoutEventsByTransaction[transactionHash] || []
                        }
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

function InnerTable({ distributions }: PayoutsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Payout Address
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {distributions?.map((distribution) => (
            <tr key={distribution.projectId}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {distribution.projectId}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {distribution.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExportVotes(props: { totalVotes: string }) {
  const { mutateAsync, isPending } = api.ballot.export.useMutation();
  const round = useCurrentRound();
  const roundType = round.data?.type;
  let columns: string[] = [];
  if (roundType === "project") {
    columns = [
      "voterId",
      "signature",
      "publishedAt",
      "project",
      "amount",
      "id",
    ];
  } else if (roundType === "impact") {
    columns = ["voterId", "signature", "publishedAt", "amount", "id"];
  }
  const exportCSV = useCallback(async () => {
    const ballots = await mutateAsync();
    // Generate CSV file
    const csv = format(ballots, {
      columns: columns,
    });
    window.open(`data:text/csv;charset=utf-8,${csv}`);
  }, [mutateAsync]);

  return (
    <Button variant="outline" isLoading={isPending} onClick={exportCSV}>
      Download votes
    </Button>
  );
}
