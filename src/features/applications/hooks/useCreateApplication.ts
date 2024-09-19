import { useMutation } from "@tanstack/react-query";
import { config, eas } from "~/config";
import { useUploadMetadata } from "~/hooks/useMetadata";
import { useAttest, useCreateAttestation } from "~/hooks/useEAS";
import type { Application, Profile } from "../types";
import { getIsFilecoinActorError } from "~/utils/errorHandler";
import { toast } from "sonner";

export function useCreateApplication({ onSuccess }: { onSuccess: () => void }) {
  const attestation = useCreateAttestation();
  const attest = useAttest();
  const upload = useUploadMetadata();

  const mutation = useMutation({
    onSuccess,
    onError: (err: { reason?: string; data?: { message: string } }) => {
      const actorNotFound = getIsFilecoinActorError(err as string);
      toast.error("Application create error", {
        description: actorNotFound
          ? "Insufficient Funds"
          : (err.reason ?? err.data?.message ?? "Transaction Rejected"),
      });
    },
    mutationFn: async (values: {
      application: Application;
      profile: Profile;
    }) => {
      if (!config.roundId) throw new Error("Round ID must be defined");

      return Promise.all([
        upload.mutateAsync(values.application).then(({ url: metadataPtr }) => {
          console.log("Creating application attestation data");
          return attestation.mutateAsync({
            schemaUID: eas.schemas.metadata,
            values: {
              name: values.profile.name,
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
