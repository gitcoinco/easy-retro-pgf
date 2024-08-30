import { Button } from "~/components/ui/Button";

type Props = {
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
};

export function ApproveButton({ disabled, isLoading, onClick }: Props) {
  return (
    <Button
      size="sm"
      variant="primary"
      disabled={disabled}
      isLoading={isLoading}
      onClick={onClick}
    >
      Approve
    </Button>
  );
}
