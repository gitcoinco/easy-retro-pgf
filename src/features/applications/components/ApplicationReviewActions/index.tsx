"use client";

import { Badge } from "~/components/ui/Badge";
import { useApplicationReview } from "../../hooks/useApplicationReview";
import { ReviewActionButton } from "./ReviewActionButton";

enum StatusBadgeVariant {
  pending = "info",
  approved = "success",
  rejected = "warning",
}

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

  const type = status === "approved" ? "revoke" : "approve";
  const isLoading = type === "approve" ? approveIsPending : revokeIsPending;
  const disabled =
    type === "revoke" ? !userCanRevoke || revokeIsPending : approveIsPending;
  const onClick = type === "approve" ? onApprove : onRevoke;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={status && StatusBadgeVariant[status]} size={"lg"}>
        {status}
      </Badge>
      <ReviewActionButton
        type={type}
        onClick={onClick}
        disabled={disabled}
        isLoading={isLoading}
        isAdmin={!!isAdmin}
      />
    </div>
  );
}
