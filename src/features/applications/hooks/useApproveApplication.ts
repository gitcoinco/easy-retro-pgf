import { useAttest } from "~/hooks/useEAS";
import { useMutation } from "@tanstack/react-query";
import { createAttestation } from "~/lib/eas/createAttestation";
import { config, eas } from "~/config";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { toast } from "sonner";

export function useApproveApplication(opts?: { onSuccess?: () => void }) {
  const attest = useAttest();
  const signer = useEthersSigner();

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

      const attestations = await Promise.all(
        applicationIds.map((refUID) =>
          createAttestation(
            {
              values: { type: "application", round: config.roundId },
              schemaUID: eas.schemas.approval,
              refUID,
            },
            signer,
          ),
        ),
      );
      return attest.mutateAsync(
        attestations.map((att) => ({ ...att, data: [att.data] })),
      );
    },
  });
}
