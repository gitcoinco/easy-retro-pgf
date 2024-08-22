import type {
  AttestationFetcher,
  PartialRound,
} from "~/utils/fetchAttestations/types";
import { fetchProfiles } from "./fetchProfiles";
import { TRPCError } from "@trpc/server";

export async function fetchProfile({
  attestationFetcher,
  round,
  recipients,
}: {
  attestationFetcher: AttestationFetcher;
  round: PartialRound;
  recipients: string[];
}) {
  const { id: roundId, network } = round;
  if (!roundId) throw new Error("Round ID must be defined");
  if (!network) throw new Error("Round network must be configured");

  const profiles = await fetchProfiles({
    attestationFetcher,
    round,
    recipients,
  });

  const [profile] = profiles;
  if (!profile) {
    throw new TRPCError({
      message: `Failed fetching attestation for recipients: ${JSON.stringify(recipients)}`,
      code: "NOT_FOUND",
    });
  }
  return profile;
}
