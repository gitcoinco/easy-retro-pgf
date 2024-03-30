import { eas } from "~/config";
import { useAttest } from "~/hooks/useEAS";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { useMutation } from "@tanstack/react-query";
import { createAttestation } from "~/lib/eas/createAttestation";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";

// TODO: Move this to a shared folders
export type TransactionError = { reason?: string; data?: { message: string } };

export function useVoters() {
  return api.voters.list.useQuery();
}

export function useApproveVoters({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (err: TransactionError) => void;
}) {
  const attest = useAttest();
  const signer = useEthersSigner();
  const { data: round } = useCurrentRound();
  const roundId = String(round?.id);

  return useMutation({
    mutationFn: async (voters: string[]) => {
      if (!signer) throw new Error("Connect wallet first");
      if (!roundId) throw new Error("Round ID must be defined");

      const attestations = await Promise.all(
        voters.map((recipient) =>
          createAttestation(
            {
              values: { type: "voter", round: roundId },
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
