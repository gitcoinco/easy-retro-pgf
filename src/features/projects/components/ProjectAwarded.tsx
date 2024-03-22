import { Button } from "~/components/ui/Button";
import { useRoundToken } from "~/features/distribute/hooks/useAlloPool";
import { useProjectResults } from "~/hooks/useResults";
import { formatNumber } from "~/utils/formatNumber";

export function ProjectAwarded({ id = "" }) {
  const amount = useProjectResults(id);
  const token = useRoundToken();
  if (amount.isLoading) return null;
  return (
    <Button variant="primary">
      {formatNumber(amount.data ?? 0)} {token.data?.symbol}
    </Button>
  );
}
