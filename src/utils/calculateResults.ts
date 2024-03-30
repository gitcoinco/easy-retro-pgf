import { type Vote } from "~/features/ballot/types";

/*
Payout styles:
Custom: 
- Sum up all the votes
OP-style:
- A project must have a minimum of x voters (threshold)
- Median value is counted
*/

export type PayoutOptions = { style: "standard" | "op"; threshold?: number };
export type BallotResults = Record<
  string,
  {
    voters: number;
    votes: number;
  }
>;
export function calculateVotes(
  ballots: { voterId: string; votes: Vote[] }[],
  payoutOpts: PayoutOptions,
): BallotResults {
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
      projectVotes[vote.projectId]!.total += vote.amount;
      projectVotes[vote.projectId]!.amounts.push(vote.amount);
      projectVotes[vote.projectId]!.voterIds.add(ballot.voterId);
    }
  }

  const projects: BallotResults = {};
  for (const projectId in projectVotes) {
    const { total, amounts, voterIds } = projectVotes[projectId]!;
    const voteIsCounted =
      payoutOpts.style === "standard" ||
      (payoutOpts.threshold && voterIds.size >= payoutOpts.threshold);

    if (voteIsCounted) {
      projects[projectId] = {
        voters: voterIds.size,
        votes:
          payoutOpts.style === "op"
            ? calculateMedian(amounts.sort((a, b) => a - b))
            : total,
      };
    }
  }

  return projects;
}

function calculateAverage(votes: number[]) {
  if (votes.length === 0) {
    return 0;
  }

  const sum = votes.reduce((sum, x) => sum + x, 0);

  const average = sum / votes.length;

  return Math.round(average);
}

function calculateMedian(arr: number[]): number {
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 !== 0
    ? arr[mid] ?? 0
    : ((arr[mid - 1] ?? 0) + (arr[mid] ?? 0)) / 2;
}
