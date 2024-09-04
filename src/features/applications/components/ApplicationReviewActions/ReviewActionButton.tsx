import { EnsureCorrectNetwork } from "~/components/EnsureCorrectNetwork";
import { Button } from "~/components/ui/Button";

type ReviewActionType = "approve" | "revoke";

type Props = {
  type?: ReviewActionType;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isAdmin?: boolean;
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
  const config = !!type ? BUTTON_CONFIG[type] : { text: "", variant: "" };

  if (!!type && !isAdmin) return null;

  return (
    <EnsureCorrectNetwork>
      <Button
        size="sm"
        className="min-w-[100px]"
        variant={config.variant}
        disabled={disabled}
        isLoading={!type || isLoading}
        onClick={onClick}
      >
        {config.text}
      </Button>
    </EnsureCorrectNetwork>
  );
}
