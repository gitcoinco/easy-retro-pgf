import { useAttest, useRevoke } from "~/hooks/useEAS";
import { useMutation } from "@tanstack/react-query";
import { createAttestation } from "~/lib/eas/createAttestation";
import { eas } from "~/config";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { toast } from "sonner";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { getContracts } from "~/lib/eas/createEAS";

export function useApproveApplication(opts?: { onSuccess?: () => void }) {
  const attest = useAttest();
  const signer = useEthersSigner();

  const { data: round } = useCurrentRound();

  return useMutation({
    onSuccess: () => {
      toast.success("Application approved successfully!");
      opts?.onSuccess?.();
    },
    onError: (err: { reason?: string; data?: { message: string } }) =>
      toast.error("Application approve error", {
        description: err.reason ?? err.data?.message,
      }),
    mutationFn: async (applicationIds: string[]) => {
      if (!signer) throw new Error("Connect wallet first");
      if (!round?.network) throw new Error("Round network not configured");

      const contracts = getContracts(round.network);

      const attestations = await Promise.all(
        applicationIds.map((refUID) =>
          createAttestation(
            {
              values: { type: "application", round: round.id },
              schemaUID: contracts.schemas.approval,
              refUID,
            },
            signer,
            contracts,
          ),
        ),
      );
      return attest.mutateAsync(
        attestations.map((att) => ({ ...att, data: [att.data] })),
      );
    },
  });
}

export function useRevokeApplication(opts?: { onSuccess?: () => void }) {
  const revoke = useRevoke();
  const signer = useEthersSigner();

  const { data: round } = useCurrentRound();

  return useMutation({
    onSuccess: () => {
      toast.success("Application approved successfully!");
      opts?.onSuccess?.();
    },
    onError: (err: { reason?: string; data?: { message: string } }) => {
      toast.error("Application approve error", {
        description: err.reason ?? err.data?.message,
      });
    },
    mutationFn: async (applicationIds: string[]) => {
      if (!signer) throw new Error("Connect wallet first");
      if (!round?.network) throw new Error("Round network not configured");

      const contracts = getContracts(round.network);

      return revoke.mutateAsync(
        applicationIds.map((uid) => ({
          schema: contracts.schemas.approval,
          data: [{ uid }],
        })),
      );
    },
  });
}
