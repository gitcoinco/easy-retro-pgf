export function calculatePayout(
  votes: number,
  totalVotes: bigint,
  totalTokens: bigint,
) {
  return (BigInt(Math.round(votes * 100)) * totalTokens) / totalVotes / 100n;
}
