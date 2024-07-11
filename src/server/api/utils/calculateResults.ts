import type { Allocation } from "~/features/ballot/types";

export type PayoutOptions = {
  calculation: "average" | "median" | "sum";
  threshold?: number;
};
export type BallotResults = Record<
  string,
  {
    voters: number;
    allocations: number;
  }
>;
export function calculateVotes(
  ballots: { voterId: string; allocations: Allocation[] }[],
  payoutOpts: PayoutOptions,
): BallotResults {
  const votes: Record<
    string,
    {
      total: number;
      amounts: number[];
      voterIds: Set<string>;
    }
  > = {};

  for (const ballot of ballots) {
    for (const vote of ballot.allocations) {
      if (!votes[vote.id]) {
        votes[vote.id] = {
          total: 0,
          amounts: [],
          voterIds: new Set(),
        };
      }
      votes[vote.id]!.amounts.push(vote.amount);
      votes[vote.id]!.voterIds.add(ballot.voterId);
    }
  }

  const projects: BallotResults = {};

  const calcFunctions = {
    average: calculateAverage,
    median: calculateMedian,
    sum: calculateSum,
  };

  for (const id in votes) {
    const { amounts, voterIds } = votes[id]!;
    const voteIsCounted =
      payoutOpts.threshold && voterIds.size >= payoutOpts.threshold;

    if (voteIsCounted) {
      projects[id] = {
        voters: voterIds.size,
        allocations: calcFunctions[payoutOpts.calculation ?? "average"]?.(
          amounts.sort((a, b) => a - b),
        ),
      };
    }
  }

  return projects;
}

function calculateSum(arr: number[]) {
  return arr?.reduce((sum, x) => sum + x, 0);
}
function calculateAverage(arr: number[]) {
  if (arr.length === 0) {
    return 0;
  }

  const sum = arr.reduce((sum, x) => sum + x, 0);
  const average = sum / arr.length;

  return Math.floor(average);
}

function calculateMedian(arr: number[]): number {
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 !== 0
    ? arr[mid] ?? 0
    : ((arr[mid - 1] ?? 0) + (arr[mid] ?? 0)) / 2;
}
