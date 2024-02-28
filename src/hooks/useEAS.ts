import { useMutation } from "@tanstack/react-query";
import { type MultiAttestationRequest } from "@ethereum-attestation-service/eas-sdk";

import { useEthersSigner } from "~/hooks/useEthersSigner";
import { createAttestation } from "~/lib/eas/createAttestation";
import { createEAS } from "~/lib/eas/createEAS";
import type { JsonRpcSigner } from "ethers";

export function useCreateAttestation() {
  const signer = useEthersSigner();

  return useMutation({
    mutationFn: async (data: {
      values: Record<string, unknown>;
      schemaUID: string;
    }) => {
      if (!signer) throw new Error("Connect wallet first");

      return createAttestation(data, signer as JsonRpcSigner);
    },
  });
}

export function useAttest() {
  const signer = useEthersSigner();

  return useMutation({
    mutationFn: (attestations: MultiAttestationRequest[]) => {
      if (!signer) throw new Error("Connect wallet first");
      const eas = createEAS(signer as JsonRpcSigner);

      return eas.multiAttest(attestations);
    },
  });
}
