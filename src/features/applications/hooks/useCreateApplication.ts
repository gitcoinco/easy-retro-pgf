import { useMutation } from "@tanstack/react-query";
import { eas } from "~/config";
import { useUploadMetadata } from "~/hooks/useMetadata";
import { useAttest, useCreateAttestation } from "~/hooks/useEAS";
import type { Application, Profile } from "../types";
import { type TransactionError } from "~/features/voters/hooks/useApproveVoters";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { getContracts } from "~/lib/eas/createEAS";
import { RoundTypes } from "~/features/rounds/types";
import { v4 as uuidV4 } from "uuid";

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

  const { id: roundId, network, type } = round ?? {};

  const isImpactRound = (type as RoundTypes) === RoundTypes.impact;

  if (!roundId) throw new Error("Round ID must be defined");
  if (!network) throw new Error("Round network must be configured");

  const contracts = getContracts(network);

  const schemaUID: string = isImpactRound
    ? contracts.schemas.metadataV2
    : contracts.schemas.metadata;

  const mutation = useMutation({
    onSuccess,
    onError,
    mutationFn: async (values: {
      application: Application;
      profile: Profile;
    }) => {
      const uuid = uuidV4();

      console.log("Uploading profile and application metadata");
      const attestations = await Promise.all([
        upload.mutateAsync(values.application).then(({ url: metadataPtr }) => {
          console.log("Creating application attestation data");
          const applicationValues = {
            name: values.application.name,
            metadataType: 0, // "http"
            metadataPtr,
            type: "application",
            round: roundId,
            ...(isImpactRound && { uuid }),
          };

          return attestation.mutateAsync({
            schemaUID,
            values: applicationValues,
          });
        }),
        upload.mutateAsync(values.profile).then(({ url: metadataPtr }) => {
          console.log("Creating profile attestation data");
          const profileValues = {
            name: values.profile.name,
            metadataType: 0, // "http"
            metadataPtr,
            type: "profile",
            round: roundId,
            ...(isImpactRound && { uuid }),
          };

          return attestation.mutateAsync({
            schemaUID,
            values: profileValues,
          });
        }),
      ]);

      console.log("Creating onchain attestations", attestations, values);
      return attest.mutateAsync(
        attestations.map((att) => ({ ...att, data: [att.data] })),
      );
    },
  });

  return {
    ...mutation,
    error: attest.error || upload.error || mutation.error,
    isAttesting: attest.isPending,
    isUploading: upload.isPending,
  };
}
