"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { useRevokeAttestations } from "~/hooks/useRevokeAttestations";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { useApplicationStatus } from "./useApplicationStatus";
import { useApproveApplication } from "./useApproveApplication";

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

  const { isCorrectNetwork, switchToCorrectChain } = useIsCorrectNetwork();

  const { data, refetch: refetchAttestations } = useApplicationStatus({
    projectId,
    withAttestations: true,
    opts: { enabled: true, refetchInterval },
  });

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

  const lastAttestation = attestations?.[0];

  const unrevokedUserAttestationsIds = attestations
    ?.filter(
      (attestation) => !attestation.revoked && attestation.attester === address,
    )
    .map((attestation) => attestation.id);

  const userCanRevoke = lastAttestation?.attester === address;

  const handleRevoke = useCallback(
    (attestations?: string[]) => {
      if (!attestations) {
        return toast.error("Error: No attestations ids to revoke");
      } else if (!isCorrectNetwork) {
        switchToCorrectChain();
      } else {
        revoke(attestations);
        setIsRevoking(true);
      }
    },
    [revoke, isCorrectNetwork],
  );

  const handleApprove = useCallback(
    (projectIds: string[]) => {
      if (!isCorrectNetwork) {
        switchToCorrectChain();
      } else {
        approve(projectIds);
        setIsApproving(true);
      }
    },
    [approve, isCorrectNetwork],
  );

  return {
    status,
    isAdmin,
    userCanRevoke,
    isCorrectNetwork,
    onApprove: () => handleApprove([projectId]),
    onRevoke: () => handleRevoke(unrevokedUserAttestationsIds),
    revokeIsPending: revokeFlags.isPending || isRevoking,
    approveIsPending: approveFlags.isPending || isApproving,
  };
};
