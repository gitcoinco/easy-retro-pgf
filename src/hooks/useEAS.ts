import { useMutation } from "@tanstack/react-query";
import {
  type MultiRevocationRequest,
  type MultiAttestationRequest,
} from "@ethereum-attestation-service/eas-sdk";

import { useEthersSigner } from "~/hooks/useEthersSigner";
import { createAttestation } from "~/lib/eas/createAttestation";
import { createEAS } from "~/lib/eas/createEAS";

export function useCreateAttestation() {
  const signer = useEthersSigner();
  return useMutation({
    mutationFn: async (data: {
      values: Record<string, unknown>;
      schemaUID: string;
    }) => {
      if (!signer) throw new Error("Connect wallet first");
      return createAttestation(data, signer);
    },
  });
}

export function useAttest() {
  const signer = useEthersSigner();
  return useMutation({
    mutationFn: async (attestations: MultiAttestationRequest[]) => {
      if (!signer) throw new Error("Connect wallet first");
      const eas = createEAS(signer);

      return eas.multiAttest(attestations);
    },
  });
}

export function useRevoke() {
  const signer = useEthersSigner();
  return useMutation({
    mutationFn: async (revocations: MultiRevocationRequest[]) => {
      if (!signer) throw new Error("Connect wallet first");
      const eas = createEAS(signer);
      return eas.multiRevoke(revocations);
    },
  });
}
