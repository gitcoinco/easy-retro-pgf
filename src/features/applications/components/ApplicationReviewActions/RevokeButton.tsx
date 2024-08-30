import { Button } from "~/components/ui/Button";

type Props = {
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
};

export function RevokeButton({ disabled, isLoading, onClick }: Props) {
  return (
    <Button
      size="sm"
      variant="danger"
      disabled={disabled}
      isLoading={isLoading}
      onClick={onClick}
    >
      Revoke
    </Button>
  );
}
