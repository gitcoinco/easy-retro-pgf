import { describe, expect, test } from "vitest";
import { calculateVotes } from "./calculateResults";
import { Allocation } from "~/features/ballot/types";

const ballots: { voterId: string; allocations: Allocation[] }[] = [
  {
    voterId: "voterA",
    allocations: [
      {
        id: "projectA",
        amount: 21,
      },
      {
        id: "projectB",
        amount: 32,
      },
    ],
  },
  {
    voterId: "voterB",
    allocations: [
      {
        id: "projectA",
        amount: 22,
      },
      {
        id: "projectB",
        amount: 54,
      },
    ],
  },
  {
    voterId: "voterC",
    allocations: [
      {
        id: "projectA",
        amount: 34,
      },
      {
        id: "projectB",
        amount: 41,
      },
      {
        id: "projectC",
        amount: 65,
      },
    ],
  },
  {
    voterId: "voterD",
    allocations: [
      {
        id: "projectA",
        amount: 37,
      },
      {
        id: "projectC",
        amount: 70,
      },
    ],
  },
];

const ballotsSingleVoterSingleProject: {
  voterId: string;
  allocations: Allocation[];
}[] = [
  {
    voterId: "voterA",
    allocations: [
      {
        id: "projectA",
        amount: 21,
      },
    ],
  },
];

const ballotsMultipleVotersSingleProject: {
  voterId: string;
  allocations: Allocation[];
}[] = [
  {
    voterId: "voterA",
    allocations: [
      {
        id: "projectA",
        amount: 21,
      },
    ],
  },
  {
    voterId: "voterB",
    allocations: [
      {
        id: "projectA",
        amount: 29,
      },
    ],
  },
];

describe("Calculate results", () => {
  test("Sum payout", () => {
    const actual = calculateVotes(ballots, {
      calculation: "sum",
      threshold: 2,
    });

    expect(actual).toMatchInlineSnapshot(`
      {
        "projectA": {
          "allocations": 114,
          "voters": 4,
        },
        "projectB": {
          "allocations": 127,
          "voters": 3,
        },
        "projectC": {
          "allocations": 135,
          "voters": 2,
        },
      }
    `);
  });

  test("Median payout", () => {
    const actual = calculateVotes(ballots, {
      calculation: "median",
      threshold: 3,
    });

    expect(actual).toMatchInlineSnapshot(`
      {
        "projectA": {
          "allocations": 28,
          "voters": 4,
        },
        "projectB": {
          "allocations": 41,
          "voters": 3,
        },
      }
    `);
  });

  test("Average payout", () => {
    const calculationThreshold3 = calculateVotes(ballots, {
      calculation: "average",
      threshold: 3,
    });

    expect(calculationThreshold3).toMatchInlineSnapshot(`
      {
        "projectA": {
          "allocations": 28,
          "voters": 4,
        },
        "projectB": {
          "allocations": 42,
          "voters": 3,
        },
      }
    `);

    const calculationThreshold2 = calculateVotes(ballots, {
      calculation: "average",
      threshold: 2,
    });

    expect(calculationThreshold2).toMatchInlineSnapshot(`
      {
        "projectA": {
          "allocations": 28,
          "voters": 4,
        },
        "projectB": {
          "allocations": 42,
          "voters": 3,
        },
        "projectC": {
          "allocations": 67,
          "voters": 2,
        },
      }
    `);
  });

  test("No allocations", () => {
    const actual = calculateVotes([], {
      calculation: "sum",
    });
    expect(actual).toEqual({});
  });

  test("Threshold not met", () => {
    const sumCalculation = calculateVotes(ballots, {
      calculation: "sum",
      threshold: 5,
    });
    const medianCalculation = calculateVotes(ballots, {
      calculation: "median",
      threshold: 5,
    });
    const averageCalculation = calculateVotes(ballots, {
      calculation: "average",
      threshold: 5,
    });

    expect(sumCalculation).toEqual({});
    expect(medianCalculation).toEqual({});
    expect(averageCalculation).toEqual({});
  });

  test("Single voter single project", () => {
    const actual = calculateVotes(ballotsSingleVoterSingleProject, {
      calculation: "sum",
    });
    expect(actual).toEqual({
      projectA: {
        allocations: 21,
        voters: 1,
      },
    });
  });

  test("Multiple voters single project", () => {
    const actual = calculateVotes(ballotsMultipleVotersSingleProject, {
      calculation: "sum",
    });
    expect(actual).toEqual({
      projectA: {
        allocations: 50,
        voters: 2,
      },
    });
  });

  test("Average payout with different thresholds", () => {
    const actualThreshold0 = calculateVotes(ballots, {
      calculation: "average",
      threshold: 0,
    });
    const actualThreshold1 = calculateVotes(ballots, {
      calculation: "average",
      threshold: 1,
    });
    const actualThreshold2 = calculateVotes(ballots, {
      calculation: "average",
      threshold: 2,
    });
    const actualThreshold3 = calculateVotes(ballots, {
      calculation: "average",
      threshold: 3,
    });
    const actualThreshold4 = calculateVotes(ballots, {
      calculation: "average",
      threshold: 4,
    });

    expect(actualThreshold0).toMatchInlineSnapshot(`
      {
        "projectA": {
          "allocations": 28,
          "voters": 4,
        },
        "projectB": {
          "allocations": 42,
          "voters": 3,
        },
        "projectC": {
          "allocations": 67,
          "voters": 2,
        },
      }
    `);

    expect(actualThreshold1).toEqual(actualThreshold0);

    expect(actualThreshold2).toMatchInlineSnapshot(`
      {
        "projectA": {
          "allocations": 28,
          "voters": 4,
        },
        "projectB": {
          "allocations": 42,
          "voters": 3,
        },
        "projectC": {
          "allocations": 67,
          "voters": 2,
        },
      }
    `);

    expect(actualThreshold3).toMatchInlineSnapshot(`
      {
        "projectA": {
          "allocations": 28,
          "voters": 4,
        },
        "projectB": {
          "allocations": 42,
          "voters": 3,
        },
      }
    `);

    expect(actualThreshold4).toMatchInlineSnapshot(`
      {
        "projectA": {
          "allocations": 28,
          "voters": 4,
        },
      }
    `);
  });
});
