export const ballotTypedData = (chainId?: number) =>
  ({
    primaryType: "Ballot",
    domain: {
      name: "Sign ballot",
      version: "1",
      chainId,
    },
    types: {
      Ballot: [
        { name: "allocations_count", type: "uint256" },
        { name: "allocations_sum", type: "uint256" },
        { name: "hashed_allocations", type: "string" },
      ],
    },
  }) as const;
