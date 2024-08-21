import { useRevoke } from "~/hooks/useEAS";
import { useMutation } from "@tanstack/react-query";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { toast } from "sonner";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { getContracts } from "~/lib/eas/createEAS";

export function useRevokeAttestations(opts?: {
  onSuccess?: () => void,
  onError?: (err: { reason?: string; data?: { message: string } }) => void,
}) {
  const revoke = useRevoke();
  const signer = useEthersSigner();

  const { data: round } = useCurrentRound();

  return useMutation({
    onSuccess: () => {
      toast.success("Attestations revoked successfully!");
      opts?.onSuccess?.();
    },
    onError: (err: { reason?: string; data?: { message: string } }) => {
      toast.error("Attestations revoke error", {
        description: err.reason ?? err.data?.message,
      });
    },
    mutationFn: async (attestationIds: string[]) => {
      if (!signer) throw new Error("Connect wallet first");
      if (!round?.network) throw new Error("Round network not configured");

      const contracts = getContracts(round.network);

      return revoke.mutateAsync(
        attestationIds.map((uid) => ({
          schema: contracts.schemas.approval,
          data: [{ uid }],
        })),
      );
    },
  });
}
