import { useMutation } from "@tanstack/react-query";
import {
  type MultiRevocationRequest,
  type MultiAttestationRequest,
} from "@ethereum-attestation-service/eas-sdk";
import { EAS__factory } from "@ethereum-attestation-service/eas-contracts";

import { useEthersSigner } from "~/hooks/useEthersSigner";
import { createAttestation } from "~/lib/eas/createAttestation";
import { getContracts } from "~/lib/eas/createEAS";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { getAddress, zeroHash } from "viem";
import { handleTransactionError } from "~/utils/errorHandler";
import { usePublicClient, useWalletClient } from "wagmi";

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
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  return useMutation({
    mutationFn: async (attestations: MultiAttestationRequest[]) => {
      if (!signer) throw new Error("Connect wallet first");
      if (!round?.network) throw new Error("Round network not configured");
      if (!walletClient) throw new Error("Wallet client not configured");
      if (!publicClient) throw new Error("Public client not configured");
      const abi = EAS__factory.abi;

      const args = attestations.map((r) => {
        return {
          schema: r.schema as `0x${string}`,
          data: r.data.map((a) => {
            return {
              recipient: a.recipient as `0x${string}`,
              expirationTime: BigInt(a.expirationTime ?? 0),
              revocable: a.revocable ?? true,
              refUID: (a.refUID ?? zeroHash) as `0x${string}`,
              data: a.data as `0x${string}`,
              value: BigInt(a.value ?? 0),
            };
          }),
        };
      });

      try {
        const { request } = await publicClient.simulateContract({
          address: getAddress(getContracts(round.network).eas),
          abi: abi,
          functionName: "multiAttest",
          account: getAddress(signer.address),
          args: [args],
        });
        const hash = await walletClient.writeContract(request);
        await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 2,
        });
      } catch (error) {
        handleTransactionError(error);
      }
    },
  });
}
export function useRevoke() {
  const signer = useEthersSigner();
  const { data: round } = useCurrentRound();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  return useMutation({
    mutationFn: async (revocations: MultiRevocationRequest[]) => {
      if (!signer) throw new Error("Connect wallet first");
      if (!round?.network) throw new Error("Round network not configured");
      if (!walletClient) throw new Error("Wallet client not configured");
      if (!publicClient) throw new Error("Public client not configured");
      const abi = EAS__factory.abi;
      const args = revocations.map((r) => {
        return {
          schema: r.schema as `0x${string}`,
          data: r.data.map((a) => {
            return {
              uid: a.uid as `0x${string}`,
              value: BigInt(0),
            };
          }),
        };
      });

      try {
        const { request } = await publicClient.simulateContract({
          address: getAddress(getContracts(round.network).eas),
          abi: abi,
          functionName: "multiRevoke",
          account: getAddress(signer.address),
          args: [args],
        });
        const hash = await walletClient.writeContract(request);
        await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 2,
        });
      } catch (error) {
        handleTransactionError(error);
      }
    },
  });
}
