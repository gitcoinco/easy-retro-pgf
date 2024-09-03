import { EnsureCorrectNetwork } from "~/components/EnsureCorrectNetwork";
import { Button } from "~/components/ui/Button";

type ReviewActionType = "approve" | "revoke";

type Props = {
  type: ReviewActionType;
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  isAdmin: boolean;
};

const BUTTON_CONFIG: Record<
  ReviewActionType,
  { text: string; variant: string }
> = {
  approve: { text: "Approve", variant: "primary" },
  revoke: { text: "Revoke", variant: "danger" },
};

export function ReviewActionButton({
  type,
  onClick,
  disabled,
  isLoading,
  isAdmin,
}: Props) {
  const config = BUTTON_CONFIG[type];

  if (!isAdmin) return null;

  return (
    <EnsureCorrectNetwork>
      <Button
        size="sm"
        variant={config.variant}
        disabled={disabled}
        isLoading={isLoading}
        onClick={onClick}
      >
        {config.text}
      </Button>
    </EnsureCorrectNetwork>
  );
}
