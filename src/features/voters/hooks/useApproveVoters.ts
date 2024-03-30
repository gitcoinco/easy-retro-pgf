import { config, eas } from "~/config";
import { useAttest } from "~/hooks/useEAS";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { useMutation } from "@tanstack/react-query";
import { createAttestation } from "~/lib/eas/createAttestation";

// TODO: Move this to a shared folders
export type TransactionError = { reason?: string; data?: { message: string } };

export function useApproveVoters({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (err: TransactionError) => void;
}) {
  const attest = useAttest();
  const signer = useEthersSigner();

  return useMutation({
    mutationFn: async (voters: string[]) => {
      if (!signer) throw new Error("Connect wallet first");
      if (!config.roundId) throw new Error("Round ID must be defined");

      const attestations = await Promise.all(
        voters.map((recipient) =>
          createAttestation(
            {
              values: { type: "voter", round: config.roundId },
              schemaUID: eas.schemas.approval,
              recipient,
            },
            signer,
          ),
        ),
      );
      return attest.mutateAsync(
        attestations.map((att) => ({ ...att, data: [att.data] })),
      );
    },
    onSuccess,
    onError,
  });
}
