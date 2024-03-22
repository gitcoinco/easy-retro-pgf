import { useMutation } from "@tanstack/react-query";
import { eas } from "~/config";
import { useUploadMetadata } from "~/hooks/useMetadata";
import { useAttest, useCreateAttestation } from "~/hooks/useEAS";
import { type TransactionError } from "~/features/voters/hooks/useApproveVoters";
import { type List } from "../types";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

export function useCreateList(options: {
  onSuccess: () => void;
  onError: (err: TransactionError) => void;
}) {
  const attestation = useCreateAttestation();
  const attest = useAttest();
  const upload = useUploadMetadata();

  const { data: round } = useCurrentRound();
  const roundId = String(round?.id);

  const mutation = useMutation(
    async (values: List) => {
      console.log("Uploading list metadata");
      return upload
        .mutateAsync(values)
        .then(({ url: metadataPtr }) => {
          console.log("Creating application attestation data");
          return attestation.mutateAsync({
            schemaUID: eas.schemas.metadata,
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

    options,
  );

  return {
    ...mutation,
    error: attest.error || upload.error || mutation.error,
    isAttesting: attest.isLoading,
    isUploading: upload.isLoading,
  };
}
