import { eas } from "~/config";
import { useAttest } from "~/hooks/useEAS";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { useMutation } from "@tanstack/react-query";
import { createAttestation } from "~/lib/eas/createAttestation";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";
import { getContracts } from "~/lib/eas/createEAS";

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

  return useMutation({
    mutationFn: async (voters: string[]) => {
      if (!signer) throw new Error("Connect wallet first");
      if (!round) throw new Error("Round must be defined");
      if (!round?.network) throw new Error("Round network must be configured");

      const contracts = getContracts(round.network);
      const attestations = await Promise.all(
        voters.map((recipient) =>
          createAttestation(
            {
              values: { type: "voter", round: round.id },
              schemaUID: contracts.schemas.approval,
              recipient,
            },
            signer,
            round.network!,
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
