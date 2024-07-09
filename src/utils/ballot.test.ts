import { expect, test, describe } from "vitest";
import { verifyBallotCount, verifyBallotHash } from "./ballot";
import { Allocation } from "~/features/ballot/types";
import { keccak256 } from "viem";

describe("verifyBallotCount", () => {
  test("should return true when total votes and individual votes are within limits", () => {
    const allocations: Allocation[] = [
      { id: "project1", amount: 10, locked: true },
      { id: "project2", amount: 20, locked: true },
    ];
    const round = { maxVotesProject: 30, maxVotesTotal: 50 };
    const result = verifyBallotCount(allocations, round);
    expect(result).toBe(true);
  });

  test("should return false when total votes exceed the limit", () => {
    const allocations: Allocation[] = [
      { id: "project1", amount: 30, locked: true },
      { id: "project2", amount: 30, locked: true },
    ];
    const round = { maxVotesProject: 50, maxVotesTotal: 50 };
    const result = verifyBallotCount(allocations, round);
    expect(result).toBe(false);
  });

  test("should return false when individual vote exceeds the limit", () => {
    const allocations: Allocation[] = [
      { id: "project1", amount: 60, locked: true },
      { id: "project2", amount: 20, locked: true },
    ];
    const round = { maxVotesProject: 50, maxVotesTotal: 100 };
    const result = verifyBallotCount(allocations, round);
    expect(result).toBe(false);
  });
});

describe("verifyBallotHash", () => {
  test("should return true when hashed allocations match", async () => {
    const allocations: Allocation[] = [
      { id: "project1", amount: 10, locked: true },
      { id: "project2", amount: 20, locked: true },
    ];
    const hashedAllocations = keccak256(
      Buffer.from(JSON.stringify(allocations)),
    );
    const result = await verifyBallotHash(hashedAllocations, allocations);
    expect(result).toBe(true);
  });

  test("should return false when hashed allocations do not match", async () => {
    const allocations: Allocation[] = [
      { id: "project1", amount: 10, locked: true },
      { id: "project2", amount: 20, locked: true },
    ];
    const hashedAllocations = "0x1234567890abcdef";
    const result = await verifyBallotHash(hashedAllocations, allocations);
    expect(result).toBe(false);
  });
});
