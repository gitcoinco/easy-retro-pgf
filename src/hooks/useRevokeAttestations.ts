import { useRevoke } from "~/hooks/useEAS";
import { useMutation } from "@tanstack/react-query";
import { eas } from "~/config";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { toast } from "sonner";
import { getIsFilecoinActorError } from "~/utils/errorHandler";

export function useRevokeAttestations(opts?: { onSuccess?: () => void }) {
  const revoke = useRevoke();
  const signer = useEthersSigner();

  return useMutation({
    onSuccess: () => {
      toast.success("Attestations revoked successfully!");
      opts?.onSuccess?.();
    },
    onError: (err: { reason?: string; data?: { message: string } }) => {
      const actorNotFound = getIsFilecoinActorError(err as string);
      toast.error("Application approve error", {
        description: actorNotFound
          ? "Insufficient Funds"
          : err.reason ?? err.data?.message,
      });
    },
    mutationFn: async (attestationIds: string[]) => {
      if (!signer) throw new Error("Connect wallet first");

      return revoke.mutateAsync(
        attestationIds.map((uid) => ({
          schema: eas.schemas.approval,
          data: [{ uid }],
        })),
      );
    },
  });
}
