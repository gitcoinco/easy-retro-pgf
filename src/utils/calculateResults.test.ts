import { expect, test } from "vitest";
import { calculateResults, calculateVotes } from "./calculateResults";

describe("Calculate results", () => {
  const ballots = [
    {
      voterId: "voterA",
      votes: [
        {
          projectId: "projectA",
          amount: 20,
        },
        {
          projectId: "projectB",
          amount: 30,
        },
      ],
    },
    {
      voterId: "voterB",
      votes: [
        {
          projectId: "projectA",
          amount: 20,
        },
        {
          projectId: "projectB",
          amount: 50,
        },
      ],
    },
    {
      voterId: "voterC",
      votes: [
        {
          projectId: "projectA",
          amount: 30,
        },
        {
          projectId: "projectC",
          amount: 60,
        },
      ],
    },
  ];
  test("custom payout", () => {
    const actual = calculateResults(ballots);
    console.log(actual);
    expect(actual.totalVoters).toBe(2);
    expect(actual.totalVotes).toBe(3);
    expect(actual.projects).toStrictEqual({
      projectA: 30,
      projectB: 20,
    });
  });
  test.only("OP-style payout", () => {
    const actual = calculateVotes(ballots);
    console.log(actual);
    //     expect(actual.totalVoters).toBe(2);
    //     expect(actual.totalVotes).toBe(3);
    //     expect(actual.projects).toStrictEqual({
    //       projectA: 30,
    //       projectB: 20,
    //     });
  });
});
