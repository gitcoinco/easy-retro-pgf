export const ballotTypedData = {
  primaryType: "Ballot",
  domain: {
    name: "Sign votes",
    version: "1",
    chainId: 10,
  },
  types: {
    Ballot: [
      { name: "total_votes", type: "uint256" },
      { name: "project_count", type: "uint256" },
    ],
  },
} as const;
