import type { ApplicationStatus } from "~/server/api/routers/applications/types";
import { Badge } from "~/components/ui/Badge";

type Props = {
  status?: ApplicationStatus;
  size?: "xs" | "md" | "lg";
};

enum StatusBadgeVariant {
  pending = "info",
  approved = "success",
  rejected = "error",
}

export function ApplicationStatusBadge({ status, size = "lg" }: Props) {
  return (
    <Badge variant={status && StatusBadgeVariant[status]} size={size}>
      {status}
    </Badge>
  );
}
