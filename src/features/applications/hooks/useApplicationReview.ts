"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { useRevokeAttestations } from "~/hooks/useRevokeAttestations";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { useApproveApplication } from "./useApproveApplication";
import { api } from "~/utils/api";

const DEFAULT_REFETCH_INTERVAL = 1000 * 10;

export const useApplicationReview = ({
  projectId,
  refetchInterval = DEFAULT_REFETCH_INTERVAL,
}: {
  projectId: string;
  refetchInterval?: number;
}) => {
  const [isRevoking, setIsRevoking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const { address, isAdmin } = useCurrentUser();

  const { data, refetch: refetchAttestations } =
    api.applications.status.useQuery(
      { projectId, withAttestations: true },
      {
        staleTime: 0,
        refetchInterval,
        enabled: true,
      },
    );

  const { status, attestations } = data ?? {};

  useEffect(() => {
    switch (status) {
      case "approved":
        setIsApproving(false);
        break;
      case "rejected":
        setIsRevoking(false);
        break;
    }
  }, [status]);

  const { mutate: approve, ...approveFlags } = useApproveApplication({
    onSuccess: () => {
      refetchAttestations().catch(() => {
        toast.error("Attestations refresh failed");
      });
    },
    onError: () => {
      setIsApproving(false);
    },
  });

  const { mutate: revoke, ...revokeFlags } = useRevokeAttestations({
    onSuccess: () => {
      refetchAttestations().catch(() => {
        toast.error("Attestations refresh failed");
      });
    },
    onError: () => {
      setIsRevoking(false);
    },
  });

  const unrevokedUserAttestationsIds = attestations
    ?.filter(
      (attestation) => !attestation.revoked && attestation.attester === address,
    )
    .map((attestation) => attestation.id);

  const lastAttestation = attestations?.[0];
  const userCanRevoke =
    lastAttestation?.attester === address && !lastAttestation?.revoked;

  const handleRevoke = useCallback(
    (attestationIds?: string[]) => {
      if (!attestationIds) {
        console.error("No attestations ids to revoke");
        return;
      }
      revoke(attestationIds);
      setIsRevoking(true);
    },
    [revoke],
  );

  const handleApprove = useCallback(
    (projectIds: string[]) => {
      approve(projectIds);
      setIsApproving(true);
    },
    [approve],
  );

  return {
    status,
    isAdmin,
    userCanRevoke,
    onApprove: () => handleApprove([projectId]),
    onRevoke: () => handleRevoke(unrevokedUserAttestationsIds),
    revokeIsPending: revokeFlags.isPending || isRevoking,
    approveIsPending: approveFlags.isPending || isApproving,
  };
};
