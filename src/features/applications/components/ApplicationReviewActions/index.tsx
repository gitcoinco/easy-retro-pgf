"use client";

import { useCallback } from "react";
import Link from "next/link";
import { EyeIcon } from "lucide-react";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { useApplicationReview } from "../../hooks/useApplicationReview";
import { ReviewActionButton } from "./ReviewActionButton";

enum StatusBadgeVariant {
  pending = "info",
  approved = "success",
  rejected = "warning",
}

type Props = {
  variant?: "listItem" | "detailPage";
  projectId?: string;
  isLoading?: boolean;
};

export function ApplicationReviewActions({
  variant = "detailPage",
  projectId,
  isLoading = false,
}: Props) {
  const {
    status,
    isAdmin,
    userCanRevoke,
    onApprove,
    onRevoke,
    revokeIsPending,
    approveIsPending,
  } = useApplicationReview({ projectId });

  const domain = useCurrentDomain();

  const handleRevoke = useCallback(() => {
    if (variant === "listItem") {
      if (
        window.confirm(
          "Are you sure? This will revoke the application and must be done by the same person who approved it.",
        )
      )
        onRevoke();
    } else {
      onRevoke();
    }
  }, [variant, onRevoke]);

  const type = status === "approved" ? "revoke" : "approve";
  const disabled =
    type === "revoke" ? !userCanRevoke || revokeIsPending : approveIsPending;
  const onClick = type === "approve" ? onApprove : handleRevoke;

  return (
    <div className="flex items-center gap-4">
      {isLoading || !status ? (
        <>
          <Badge size={variant === "listItem" ? "md" : "lg"}>pending</Badge>
          <ReviewActionButton />
        </>
      ) : (
        <>
          <Badge
            variant={status && StatusBadgeVariant[status]}
            size={variant === "listItem" ? "md" : "lg"}
          >
            {status}
          </Badge>
          <ReviewActionButton
            type={type}
            onClick={onClick}
            disabled={disabled}
            isLoading={approveIsPending || revokeIsPending}
            isAdmin={!!isAdmin}
          />
        </>
      )}
      {variant === "listItem" && (
        <Button
          disabled={isLoading}
          as={Link}
          target="_blank"
          href={`/${domain}/applications/${projectId}`}
          className="no-underline"
          type="button"
          variant="link"
          size="custom"
          icon={EyeIcon}
        >
          Review
        </Button>
      )}
    </div>
  );
}
