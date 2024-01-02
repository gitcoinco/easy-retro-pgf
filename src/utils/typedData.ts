export const ballotTypedData = (chainId?: number) =>
  ({
    primaryType: "Ballot",
    domain: {
      name: "Sign votes",
      version: "1",
      chainId,
    },
    types: {
      Ballot: [
        { name: "total_votes", type: "uint256" },
        { name: "project_count", type: "uint256" },
        { name: "hashed_votes", type: "string" },
      ],
    },
  }) as const;
