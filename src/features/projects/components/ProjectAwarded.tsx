import { Button } from "~/components/ui/Button";
import { config } from "~/config";
import { useProjectResults } from "~/hooks/useResults";
import { formatNumber } from "~/utils/formatNumber";

export function ProjectAwarded({ id = "" }) {
  const amount = useProjectResults(id);

  if (amount.isLoading) return null;
  return (
    <Button variant="primary">
      {formatNumber(amount.data?.amount ?? 0)} {config.tokenName}
    </Button>
  );
}
