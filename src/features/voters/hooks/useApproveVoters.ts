import { eas } from "~/config";
import { useAttest } from "~/hooks/useEAS";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { useMutation } from "@tanstack/react-query";
import { createAttestation } from "~/lib/eas/createAttestation";

type TransactionError = { reason?: string; data?: { message: string } };

export function useApproveVoters(options: {
  onSuccess: () => void;
  onError: (err: TransactionError) => void;
}) {
  const attest = useAttest();
  const signer = useEthersSigner();

  return useMutation(async (voters: string[]) => {
    if (!signer) throw new Error("Connect wallet first");
    const attestations = await Promise.all(
      voters.map((recipient) =>
        createAttestation(
          {
            values: { type: "voter" },
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
  }, options);
}
