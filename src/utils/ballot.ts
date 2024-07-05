import { getAddress, keccak256, verifyTypedData } from "viem";
import { Allocation, BallotPublish } from "~/features/ballot/types";
import { sumBallot } from "~/features/ballot/hooks/useBallot";
import { ballotTypedData } from "~/utils/typedData";

/**
 * Verifies that the total votes in a ballot allocation do not exceed the maximum allowed votes for the round, and that each individual vote does not exceed the maximum allowed votes per project.
 *
 * @param allocations - The ballot allocations to verify.
 * @param round - The round information, including the maximum allowed total votes and maximum allowed votes per project.
 * @returns A boolean indicating whether the ballot allocations are valid.
 */
export function verifyBallotCount(
  allocations: Allocation[],
  round: { maxVotesProject: number | null; maxVotesTotal: number | null },
) {
  const sum = sumBallot(allocations);
  const validVotes = allocations.every(
    (vote) => vote.amount <= (round.maxVotesProject ?? 0),
  );
  return sum <= (round.maxVotesTotal ?? 0) && validVotes;
}

/**
 * Verifies that the provided hashed allocations match the hash of the given allocations.
 *
 * @param hashed_allocations - The hashed allocations to verify.
 * @param allocations - The allocations to hash and compare.
 * @returns A boolean indicating whether the hashed allocations match the provided hash.
 */
export async function verifyBallotHash(
  hashed_allocations: string,
  allocations: Allocation[],
) {
  console.log(
    hashed_allocations,
    keccak256(Buffer.from(JSON.stringify(allocations))),
    hashed_allocations === keccak256(Buffer.from(JSON.stringify(allocations))),
  );
  return (
    hashed_allocations === keccak256(Buffer.from(JSON.stringify(allocations)))
  );
}

/**
 * Verifies the signature of a ballot publication request.
 *
 * @param address - The Ethereum address that signed the message.
 * @param signature - The signature of the message.
 * @param message - The message that was signed.
 * @param chainId - The Ethereum chain ID.
 * @returns A promise that resolves to a boolean indicating whether the signature is valid.
 */
export async function verifyBallotSignature({
  address,
  signature,
  message,
  chainId,
}: { address: string } & BallotPublish) {
  return await verifyTypedData({
    ...ballotTypedData(chainId),
    address: getAddress(address),
    message,
    signature,
  });
}
