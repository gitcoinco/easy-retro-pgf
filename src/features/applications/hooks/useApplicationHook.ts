import { useMutation } from "@tanstack/react-query";
import { config, eas } from "~/config";
import { useUploadMetadata } from "~/hooks/useMetadata";
import { toast } from "sonner";
import { useAttest, useCreateAttestation } from "~/hooks/useEAS";
import type { ApplicationCreateSchema, ProfileSchema } from "../types";

export function useCreateApplication() {
  const attestation = useCreateAttestation();
  const attest = useAttest();
  const upload = useUploadMetadata();

  const mutation = useMutation(
    async (values: {
      application: ApplicationCreateSchema;
      profile: ProfileSchema;
    }) => {
      console.log("Uploading profile and application metadata");
      return Promise.all([
        upload.mutateAsync(values.application).then(({ url: metadataPtr }) => {
          console.log("Creating application attestation data");
          return attestation.mutateAsync({
            schemaUID: eas.schemas.metadata,
            // schemaUID: eas.schemas.applicationMetadata,
            values: {
              name: values.application.name,
              metadataType: 0, // "http"
              metadataPtr,
              type: "application",
              round: config.roundId,
            },
          });
        }),
        upload.mutateAsync(values.profile).then(({ url: metadataPtr }) => {
          console.log("Creating profile attestation data");
          return attestation.mutateAsync({
            schemaUID: eas.schemas.metadata,
            values: {
              name: values.profile.name,
              metadataType: 0, // "http"
              metadataPtr,
              type: "profile",
              round: config.roundId,
            },
          });
        }),
      ]).then((attestations) => {
        console.log("Creating onchain attestations", attestations);
        return attest.mutateAsync(
          attestations.map((att) => ({ ...att, data: [att.data] })),
        );
      });
    },

    {
      onError: (err) =>
        toast.error("Error creating application", {
          description: JSON.stringify(err),
        }),
      onSuccess: (res) => {
        console.log("Successful", res);
        toast.success("Application created successfully!");
      },
    },
  );

  return {
    ...mutation,
    error: attest.error || upload.error || mutation.error,
    isAttesting: attest.isLoading,
    isUploading: upload.isLoading,
  };
}
