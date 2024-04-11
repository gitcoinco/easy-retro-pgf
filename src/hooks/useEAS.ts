import { useMutation } from "@tanstack/react-query";
import {
  MultiRevocationRequest,
  type MultiAttestationRequest,
  RevocationRequest,
} from "@ethereum-attestation-service/eas-sdk";

import { useEthersSigner } from "~/hooks/useEthersSigner";
import { createAttestation } from "~/lib/eas/createAttestation";
import { createEAS, getContracts } from "~/lib/eas/createEAS";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

export function useCreateAttestation() {
  const signer = useEthersSigner();
  const { data: round } = useCurrentRound();
  return useMutation({
    mutationFn: async (data: {
      values: Record<string, unknown>;
      schemaUID: string;
    }) => {
      if (!signer) throw new Error("Connect wallet first");
      if (!round?.network) throw new Error("Round network not configured");
      return createAttestation(data, signer, getContracts(round.network));
    },
  });
}

export function useAttest() {
  const signer = useEthersSigner();
  const { data: round } = useCurrentRound();
  return useMutation({
    mutationFn: async (attestations: MultiAttestationRequest[]) => {
      if (!signer) throw new Error("Connect wallet first");
      if (!round?.network) throw new Error("Round network not configured");
      const eas = createEAS(signer, round?.network);
      return eas.multiAttest(attestations);
    },
  });
}
export function useRevoke() {
  const signer = useEthersSigner();
  const { data: round } = useCurrentRound();
  return useMutation({
    mutationFn: async (revocations: MultiRevocationRequest[]) => {
      if (!signer) throw new Error("Connect wallet first");
      if (!round?.network) throw new Error("Round network not configured");
      const eas = createEAS(signer, round?.network);
      return eas.multiRevoke(revocations);
    },
  });
}
