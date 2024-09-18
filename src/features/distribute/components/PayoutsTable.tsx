import { useState } from "react";
import { MainTableProps, PayoutsTableProps } from "../types";
import React from "react";
import { ArrowBigDownIcon, ArrowBigUpIcon, EyeIcon } from "lucide-react";
import { formatEther } from "viem";

export const PayoutsTable = ({
  payoutEventsByTransaction,
  explorerUrl,
}: MainTableProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const handleRowClick = (transactionHash: string) => {
    if (expandedRows.includes(transactionHash)) {
      setExpandedRows(expandedRows.filter((hash) => hash !== transactionHash));
    } else {
      setExpandedRows([...expandedRows, transactionHash]);
    }
  };

  if (
    payoutEventsByTransaction &&
    Object.keys(payoutEventsByTransaction).length === 0
  ) {
    return (
      <div className="mb-4 text-lg font-semibold">No Completed Payouts</div>
    );
  }

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
};

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
              Name
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {distributions?.map((distribution) => (
            <tr key={distribution.projectId}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {distribution.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {distribution.payoutAddress}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatEther(BigInt(distribution.amount))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
