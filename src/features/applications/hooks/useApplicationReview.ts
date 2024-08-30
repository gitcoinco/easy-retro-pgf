"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { useRevokeAttestations } from "~/hooks/useRevokeAttestations";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { useApplicationStatus } from "./useApplicationStatus";
import { useApproveApplication } from "./useApproveApplication";

const DEFAULT_REFETCH_INTERVAL = 1000 * 30;

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

  useIsCorrectNetwork({
    force: !!isAdmin,
  });

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
  });

  const { mutate: revoke, ...revokeFlags } = useRevokeAttestations({
    onSuccess: () => {
      refetchAttestations().catch(() => {
        toast.error("Attestations refresh failed");
      });
    },
  });

  const unrevokedAttestations = attestations?.filter(
    (attestation) => !attestation.revoked,
  );

  const unrevokedAttestationsIds = unrevokedAttestations?.map(
    (attestation) => attestation.id,
  );

  const userCanRevoke = unrevokedAttestations?.some(
    (attestation) => attestation?.attester === address,
  );

  const handleRevoke = useCallback(
    (attestations?: string[]) => {
      if (!attestations)
        return toast.error("Error: No attestations ids to revoke");
      revoke(attestations);
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
    onRevoke: () => handleRevoke(unrevokedAttestationsIds),
    revokeIsPending: revokeFlags.isPending || isRevoking,
    approveIsPending: approveFlags.isPending || isApproving,
  };
};
