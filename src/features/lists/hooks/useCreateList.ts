import { useMutation } from "@tanstack/react-query";
import { eas } from "~/config";
import { useUploadMetadata } from "~/hooks/useMetadata";
import { useAttest, useCreateAttestation } from "~/hooks/useEAS";
import { type TransactionError } from "~/features/voters/hooks/useApproveVoters";
import { type List } from "../types";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { getContracts } from "~/lib/eas/createEAS";

export function useCreateList({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (err: TransactionError) => void;
}) {
  const attestation = useCreateAttestation();
  const attest = useAttest();
  const upload = useUploadMetadata();

  const { data: round } = useCurrentRound();
  const roundId = String(round?.id);

  const mutation = useMutation({
    onSuccess,
    onError,
    mutationFn: async (values: List) => {
      console.log("Uploading list metadata");
      if (!round?.network) throw new Error("Round network must be configured");
      const contracts = getContracts(round.network);
      return upload
        .mutateAsync(values)
        .then(({ url: metadataPtr }) => {
          console.log("Creating application attestation data");
          return attestation.mutateAsync({
            schemaUID: contracts.schemas.metadata,
            values: {
              name: values.name,
              metadataType: 0, // "http"
              metadataPtr,
              type: "list",
              round: roundId,
            },
          });
        })
        .then((attestation) => {
          console.log("Creating onchain attestation", attestation, values);
          return attest.mutateAsync(
            [attestation].map((att) => ({ ...att, data: [att.data] })),
          );
        });
    },
  });

  return {
    ...mutation,
    error: attest.error || upload.error || mutation.error,
    isAttesting: attest.isPending,
    isUploading: upload.isPending,
  };
}
