import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Distribution } from "../types";
import { useState } from "react";
import { uuidToBytes32 } from "~/utils/uuid";
import { Spinner } from "~/components/ui/Spinner";

export const DistributionTable = ({
  distributions,
  alreadyDistributedProjects,
}: {
  distributions: Distribution[];
  alreadyDistributedProjects: Record<string, boolean> | undefined;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(distributions.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentDistributions = distributions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Paid
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {currentDistributions?.map((distribution) => (
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
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {alreadyDistributedProjects ? (
                  <div>
                    {alreadyDistributedProjects[
                      uuidToBytes32(distribution.projectId)
                    ] ? (
                      <span className="text-green-500">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </div>
                ) : (
                  <Spinner className="size-6" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="float-left mt-4 flex items-center justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg bg-green-600 px-4 py-2 text-white transition duration-200 hover:bg-green-800 disabled:bg-green-200"
        >
          <FaChevronLeft />
        </button>
        <span className="mx-4 text-lg font-semibold">
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg bg-green-600 px-4 py-2 text-white transition duration-200 hover:bg-green-800 disabled:bg-green-200"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};
