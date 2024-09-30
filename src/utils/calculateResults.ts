import { type Vote } from "~/features/ballot/types";

export type PayoutOptions = {
  calculation: "average" | "median" | "sum";
  threshold?: number;
};
export type BallotResults = Record<
  string,
  {
    voters: number;
    votes: number;
    actualVotes: number;
  }
>;
export function calculateVotes(
  ballots: { voterId: string; votes: Vote[] }[],
  payoutOpts: PayoutOptions,
): { actualTotalVotes: number; projects: BallotResults } {
  let actualTotalVotes = 0;

  const projectVotes: Record<
    string,
    {
      total: number;
      amounts: number[];
      voterIds: Set<string>;
    }
  > = {};

  for (const ballot of ballots) {
    for (const vote of ballot.votes) {
      if (!projectVotes[vote.projectId]) {
        projectVotes[vote.projectId] = {
          total: 0,
          amounts: [],
          voterIds: new Set(),
        };
      }
      projectVotes[vote.projectId]!.amounts.push(vote.amount ** 0.5);
      projectVotes[vote.projectId]!.voterIds.add(ballot.voterId);
      projectVotes[vote.projectId]!.total += vote.amount**0.5;
      actualTotalVotes += vote.amount**0.5;
    }
  }

  const projects: BallotResults = {};

  const calcFunctions = {
    average: calculateAverage,
    median: calculateMedian,
    sum: calculateSum,
  };
  for (const projectId in projectVotes) {
    const { total, amounts, voterIds } = projectVotes[projectId]!;

    const { threshold = 0 } = payoutOpts;
    const voteIsCounted = voterIds.size >= threshold;

    if (voteIsCounted) {
      projects[projectId] = {
        voters: voterIds.size,
        votes: calcFunctions[payoutOpts.calculation ?? "average"]?.(
          amounts.sort((a, b) => a - b),
        ),
        actualVotes: total,
      };
    }
  }

  return { actualTotalVotes, projects };
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

  return Math.round(average);
}

function calculateMedian(arr: number[]): number {
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 !== 0
    ? arr[mid] ?? 0
    : ((arr[mid - 1] ?? 0) + (arr[mid] ?? 0)) / 2;
}
