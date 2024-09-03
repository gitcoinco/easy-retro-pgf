"use client";

import { useApplicationReview } from "../../hooks/useApplicationReview";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { ReviewActionButton } from "./ReviewActionButton";

type Props = {
  projectId: string;
};

export function ApplicationReviewActions({ projectId }: Props) {
  const {
    status,
    isAdmin,
    userCanRevoke,
    onApprove,
    onRevoke,
    revokeIsPending,
    approveIsPending,
  } = useApplicationReview({ projectId });

  if (!status) return null;

  if (!isAdmin) return <ApplicationStatusBadge status={status} />;

  const type = status === "approved" ? "revoke" : "approve";
  const isLoading = type === "approve" ? approveIsPending : revokeIsPending;
  const disabled = type === "revoke" ? !userCanRevoke : false;
  const onClick = type === "approve" ? onApprove : onRevoke;

  return (
    <div className="flex items-center gap-2">
      <ApplicationStatusBadge status={status} />
      <ReviewActionButton
        type={type}
        onClick={onClick}
        disabled={disabled}
        isLoading={isLoading}
      />
    </div>
  );
}
