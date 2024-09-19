import { useMutation } from "@tanstack/react-query";
import {
  type MultiRevocationRequest,
  type MultiAttestationRequest,
} from "@ethereum-attestation-service/eas-sdk";
import { EAS__factory } from "@ethereum-attestation-service/eas-contracts";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { createAttestation } from "~/lib/eas/createAttestation";
import { getEASAddress } from "~/lib/eas/createEAS";
import {
  EstimateContractGasParameters,
  getAddress,
  SimulateContractParameters,
  zeroHash,
} from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { handleTransactionError } from "~/utils/errorHandler";

export function useCreateAttestation() {
  const signer = useEthersSigner();
  return useMutation({
    mutationFn: async (data: {
      values: Record<string, unknown>;
      schemaUID: string;
    }) => {
      if (!signer) throw { reason: "Connect wallet first" };
      return createAttestation(data, signer);
    },
  });
}

export function useAttest() {
  try {
    const signer = useEthersSigner();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();

    return useMutation({
      mutationFn: async (attestations: MultiAttestationRequest[]) => {
        if (!signer) throw { reason: "Connect wallet first" };
        if (!walletClient) throw { reason: "Wallet client not configured" };
        if (!publicClient) throw { reason: "Public client not configured" };
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

        const contractCallArgs = {
          address: getAddress(getEASAddress()),
          abi: abi,
          functionName: "multiAttest",
          args: [args],
        } as EstimateContractGasParameters | SimulateContractParameters;
        const estimateGas =
          await publicClient.estimateContractGas(contractCallArgs);

        const { request } =
          await publicClient.simulateContract(contractCallArgs);

        const balance = await publicClient.getBalance({
          address: getAddress(signer.address),
        });

        if (balance < estimateGas * 2n) {
          throw { reason: "Insufficient funds" };
        }

        const hash = await walletClient.writeContract(request);
        await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 1,
        });
      },
    });
  } catch (error) {
    handleTransactionError(error);
  }
}
export function useRevoke() {
  const signer = useEthersSigner();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  return useMutation({
    mutationFn: async (revocations: MultiRevocationRequest[]) => {
      if (!signer) throw { reason: "Connect wallet first" };
      if (!walletClient) throw { reason: "Wallet client not configured" };
      if (!publicClient) throw { reason: "Public client not configured" };
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
        const contractCallArgs = {
          address: getAddress(getEASAddress()),
          abi: abi,
          functionName: "multiRevoke",
          account: getAddress(signer.address),
          args: [args],
          gasPrice: await publicClient.getGasPrice(),
        } as EstimateContractGasParameters | SimulateContractParameters;

        const estimateGas =
          await publicClient.estimateContractGas(contractCallArgs);

        const { request } =
          await publicClient.simulateContract(contractCallArgs);

        const balance = await publicClient.getBalance({
          address: getAddress(signer.address),
        });

        if (balance < estimateGas * 2n) {
          throw { reason: "Insufficient funds" };
        }
        const hash = await walletClient.writeContract(request);
        await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 1,
        });
      } catch (error) {
        handleTransactionError(error);
      }
    },
  });
}
