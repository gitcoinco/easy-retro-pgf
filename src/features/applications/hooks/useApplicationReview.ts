"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { useRevokeAttestations } from "~/hooks/useRevokeAttestations";
import { useApproveApplication } from "./useApproveApplication";
import { api } from "~/utils/api";

const DEFAULT_REFETCH_INTERVAL = 1000 * 10;

export const useApplicationReview = ({
  projectId = "",
  refetchInterval = DEFAULT_REFETCH_INTERVAL,
}: {
  projectId?: string;
  refetchInterval?: number;
}) => {
  const [isRevoking, setIsRevoking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const { address, isAdmin } = useCurrentUser();

  const trpcUtils = api.useUtils();

  const {
    data,
    isPending: statusIsPending,
    refetch: refetchAttestations,
  } = api.applications.status.useQuery(
    { projectId, withAttestation: true },
    { refetchInterval, enabled: projectId !== "" },
  );

  const { status, attestation: lastAttestation } = data ?? {};

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

  const handleSuccess = useCallback(() => {
    refetchAttestations()
      .then(() => void trpcUtils.applications.status.invalidate({ projectId }))
      .catch(() => toast.error("Attestations refresh failed"));
  }, [refetchAttestations, trpcUtils.applications.status, projectId]);

  const { mutate: approve, ...approveFlags } = useApproveApplication({
    onSuccess: handleSuccess,
    onError: () => setIsApproving(false),
  });

  const { mutate: revoke, ...revokeFlags } = useRevokeAttestations({
    onSuccess: handleSuccess,
    onError: () => setIsRevoking(false),
  });

  const userCanRevoke =
    lastAttestation?.attester === address && !lastAttestation?.revoked;

  const handleRevoke = useCallback(() => {
    if (!lastAttestation?.id) {
      console.error("No attestation id to revoke");
      return;
    }
    revoke([lastAttestation.id]);
    setIsRevoking(true);
  }, [revoke, lastAttestation]);

  const handleApprove = useCallback(() => {
    approve([projectId]);
    setIsApproving(true);
  }, [approve, projectId]);

  return {
    status,
    isAdmin,
    userCanRevoke,
    onApprove: handleApprove,
    onRevoke: handleRevoke,
    statusIsPending,
    revokeIsPending: revokeFlags.isPending || isRevoking,
    approveIsPending: approveFlags.isPending || isApproving,
  };
};
