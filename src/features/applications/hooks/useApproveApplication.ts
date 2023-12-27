import { useAttest } from "~/hooks/useEAS";
import { useMutation } from "@tanstack/react-query";
import { createAttestation } from "~/lib/eas/createAttestation";
import { eas } from "~/config";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { type TransactionError } from "~/features/voters/hooks/useApproveVoters";

export function useApproveApplication(options: {
  onSuccess: () => void;
  onError: (err: TransactionError) => void;
}) {
  const attest = useAttest();
  const signer = useEthersSigner();

  return useMutation(async (applicationIds: string[]) => {
    if (!signer) throw new Error("Connect wallet first");
    const attestations = await Promise.all(
      applicationIds.map((refUID) =>
        createAttestation(
          {
            values: { type: "application" },
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
  }, options);
}
