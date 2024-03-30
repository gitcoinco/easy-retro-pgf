import { useMutation } from "@tanstack/react-query";
import { config, eas } from "~/config";
import { useUploadMetadata } from "~/hooks/useMetadata";
import { useAttest, useCreateAttestation } from "~/hooks/useEAS";
import { type TransactionError } from "~/features/voters/hooks/useApproveVoters";
import { type List } from "../types";

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

  const mutation = useMutation({
    onSuccess,
    onError,
    mutationFn: async (values: List) => {
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
              round: config.roundId,
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
