"use client";

import type { ApplicationStatus } from "~/server/api/routers/applications/types";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { useApplicationReview } from "../../hooks/useApplicationReview";
import { ApproveButton } from "./ApproveButton";
import { RevokeButton } from "./RevokeButton";

const renderActionButtons = ({
  status,
  actions: { onApprove, onRevoke } = {},
  disabled,
  loading,
}: {
  status?: ApplicationStatus;
  actions: { onApprove?: () => void; onRevoke?: () => void };
  disabled?: { approve?: boolean; revoke?: boolean };
  loading?: { approve?: boolean; revoke?: boolean };
}) => {
  const { approve: approveDisabled = false, revoke: revokeDisabled = false } =
    disabled ?? {};

  const { approve: approveLoading = false, revoke: revokeLoading = false } =
    loading ?? {};

  switch (status) {
    case "pending":
    case "rejected":
      return (
        <ApproveButton
          disabled={approveDisabled}
          isLoading={approveLoading}
          onClick={onApprove}
        />
      );

    case "approved":
      return (
        <RevokeButton
          disabled={revokeDisabled}
          isLoading={revokeLoading}
          onClick={onRevoke}
        />
      );

    default:
      return <></>;
  }
};

type Props = {
  projectId: string;
  isLoading?: boolean;
};

export function ApplicationReviewActions({ projectId, isLoading }: Props) {
  const {
    status,
    isAdmin,
    isCorrectNetwork,
    userCanRevoke,
    onApprove,
    onRevoke,
    revokeIsPending,
    approveIsPending,
  } = useApplicationReview({
    projectId,
  });

  if (!isCorrectNetwork || !isAdmin || isLoading)
    return <ApplicationStatusBadge status={status} />;

  return (
    <div className="flex items-center gap-2">
      <ApplicationStatusBadge status={status} />
      {renderActionButtons({
        status,
        actions: {
          onApprove,
          onRevoke,
        },
        disabled: {
          approve: approveIsPending,
          revoke: !userCanRevoke || revokeIsPending,
        },
        loading: {
          approve: approveIsPending,
          revoke: revokeIsPending,
        },
      })}
    </div>
  );
}
