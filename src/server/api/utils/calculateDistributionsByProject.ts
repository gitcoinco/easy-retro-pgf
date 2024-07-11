import { formatUnits } from "viem";
import { calculatePayout } from "~/server/api/utils/calculatePayout";
import { BallotResults } from "~/server/api/utils/calculateResults";

export function calculateDistributionsByProject({
  projectIds,
  payoutAddresses,
  projectVotes,
  totalVotes,
  totalTokens,
}: {
  projectIds: Array<string>;
  payoutAddresses: Record<string, string>;
  projectVotes: BallotResults;
  totalVotes: number;
  totalTokens: bigint;
}) {
  return projectIds
    ?.map((projectId) => ({
      projectId,
      payoutAddress: payoutAddresses[projectId] ?? "",
      amount: projectVotes[projectId]?.allocations ?? 0,
    }))
    .filter((p) => p.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .map((p) => {
      return {
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
      };
    });
}
