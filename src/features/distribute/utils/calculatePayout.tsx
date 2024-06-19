export function calculatePayout(
  votes: number,
  totalVotes: bigint,
  totalTokens: bigint,
) {
  return roundBigInt(
    (BigInt(Math.floor(votes * 100)) * totalTokens) / totalVotes / 100n,
    15n,
  );
}

function roundBigInt(value: bigint, precision: bigint): bigint {
  const roundingFactor = 10n ** precision;
  const remainder = value % roundingFactor;
  return value - remainder;
}
