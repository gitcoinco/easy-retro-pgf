import { useMutation } from "@tanstack/react-query";
import { eas } from "~/config";
import { useUploadMetadata } from "~/hooks/useMetadata";
import { useAttest, useCreateAttestation } from "~/hooks/useEAS";
import type { Application, Profile } from "../types";
import { type TransactionError } from "~/features/voters/hooks/useApproveVoters";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { getContracts } from "~/lib/eas/createEAS";

export function useCreateApplication({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (err: TransactionError) => void;
}) {
  const { data: round } = useCurrentRound();
  const attestation = useCreateAttestation();
  const attest = useAttest();
  const upload = useUploadMetadata();

  const roundId = String(round?.id);

  const mutation = useMutation({
    onSuccess,
    onError,
    mutationFn: async (values: {
      application: Application;
      profile: Profile;
    }) => {
      if (!roundId) throw new Error("Round ID must be defined");
      console.log("Uploading profile and application metadata");
      if (!round?.network) throw new Error("Round network must be configured");

      const contracts = getContracts(round.network);
      return Promise.all([
        upload.mutateAsync(values.application).then(({ url: metadataPtr }) => {
          console.log("Creating application attestation data");
          return attestation.mutateAsync({
            schemaUID: contracts.schemas.metadata,
            values: {
              name: values.application.name,
              metadataType: 0, // "http"
              metadataPtr,
              type: "application",
              round: roundId,
            },
          });
        }),
        upload.mutateAsync(values.profile).then(({ url: metadataPtr }) => {
          console.log("Creating profile attestation data");
          return attestation.mutateAsync({
            schemaUID: contracts.schemas.metadata,
            values: {
              name: values.profile.name,
              metadataType: 0, // "http"
              metadataPtr,
              type: "profile",
              round: roundId,
            },
          });
        }),
      ]).then((attestations) => {
        console.log("Creating onchain attestations", attestations, values);
        return attest.mutateAsync(
          attestations.map((att) => ({ ...att, data: [att.data] })),
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
