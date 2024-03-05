import { type Ballot } from "@prisma/client";
import { type Vote } from "~/features/ballot/types";

/*

OP-style:
- A project must have a minimum of x voters (threshold)

*/
type PayoutOptions = {
  style: "custom" | "op";
  threshold?: number;
};

const votes = {
  ["projectId"]: {
    voters: 3,
    votes: 100,
    median: 50,
  },
};
export function calculateResults(
  ballots: { voterId: string; votes: Vote[] }[],
  payoutOpts: PayoutOptions = { style: "custom" },
) {
  let totalVotes = 0;
  const projects = new Map<string, number>();

  const voterCounter: Record<string, number> = {};

  ballots.forEach(({ votes, voterId }) => {
    votes.forEach((vote) => {
      const { projectId, amount } = vote;
      const rewards = projects.get(projectId) ?? 0;
      projects.set(projectId, rewards + amount);

      if (!voterCounter[projectId]) {
        voterCounter[projectId] = 0;
      }
      voterCounter[projectId] += 1;
      totalVotes += 1;
    });
  });

  console.log("projects", voterCounter);

  const averageVotes = calculateAverage(
    Object.values(Object.fromEntries(projects)),
  );
  return {
    averageVotes,
    totalVoters: ballots.length,
    totalVotes: totalVotes,
    projects: Object.fromEntries(projects),
  };
}

type Ballot = {
  voterId: string;
  votes: { projectId: string; amount: number }[];
};

type Votes = Record<
  string,
  {
    voters: number;
    votes: number;
    median: number;
  }
>;
export function calculateVotes(ballots: Ballot[]) {
  let totalVotes = 0;

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
      projectVotes[vote.projectId].total += vote.amount;
      projectVotes[vote.projectId].amounts.push(vote.amount);
      projectVotes[vote.projectId].voterIds.add(ballot.voterId);

      totalVotes += 1;
    }
  }

  const projects: Votes = {};
  for (const projectId in projectVotes) {
    const { total, amounts, voterIds } = projectVotes[projectId];
    amounts.sort((a, b) => a - b);
    const median = calculateMedian(amounts);
    const average = calculateAverage(amounts);
    projects[projectId] = {
      voters: voterIds.size,
      votes: total,
      median,
      average,
    };
  }

  const averageVotes = calculateAverage(
    Object.values(projectVotes).map((p) => p.total),
  );

  return {
    averageVotes,
    totalVoters: ballots.length,
    totalVotes: totalVotes,
    projects,
  };
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
