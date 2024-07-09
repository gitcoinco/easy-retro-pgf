import { describe, expect, test } from "vitest";
import { calculateVotes } from "./calculateResults";

describe("Calculate results", () => {
  const ballots = [
    {
      voterId: "voterA",
      allocations: [
        {
          id: "projectA",
          amount: 20,
        },
        {
          id: "projectB",
          amount: 30,
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
          amount: 50,
        },
      ],
    },
    {
      voterId: "voterC",
      allocations: [
        {
          id: "projectA",
          amount: 30,
        },
        {
          id: "projectB",
          amount: 40,
        },
        {
          id: "projectC",
          amount: 60,
        },
      ],
    },
    {
      voterId: "voterD",
      allocations: [
        {
          id: "projectA",
          amount: 35,
        },
        {
          id: "projectC",
          amount: 70,
        },
      ],
    },
  ];
  test("custom payout", () => {
    const actual = calculateVotes(ballots, { style: "custom" });
    console.log(actual);

    expect(actual).toMatchInlineSnapshot(`
      {
        "projectA": {
          "voters": 4,
          "allocations": 107,
        },
        "projectB": {
          "voters": 3,
          "allocations": 120,
        },
        "projectC": {
          "voters": 2,
          "allocations": 130,
        },
      }
    `);
  });
  test("OP-style payout", () => {
    const actual = calculateVotes(ballots, { style: "op", threshold: 3 });
    console.log(actual);
    expect(actual).toMatchInlineSnapshot(`
      {
        "projectA": {
          "allocations": 26,
          "voters": 4,
        },
        "projectB": {
          "allocations": 40,
          "voters": 3,
        },
      }
    `);
  });
});
