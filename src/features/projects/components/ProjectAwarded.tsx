import { Button } from "~/components/ui/Button";
import { useProjectResults } from "~/hooks/useResults";
import { formatNumber } from "~/utils/formatNumber";

export function ProjectAwarded({ id = "" }) {
  const amount = useProjectResults(id);

  if (amount.isPending) return null;
  return (
    <Button variant="primary">
      {formatNumber(amount.data?.amount ?? 0)} votes
    </Button>
  );
}
