import { Button } from "~/components/ui/Button";
import { config } from "~/config";
import { useProjectResults } from "~/hooks/useResults";
import { formatNumber } from "~/utils/formatNumber";
import { useMaci } from "~/contexts/Maci";

export function ProjectAwarded({ id = "" }) {
  const { pollData } = useMaci();
  const amount = useProjectResults(id, pollData);

  if (amount.isLoading) return null;
  return (
    <Button variant="primary">
      {formatNumber(amount.data?.amount ?? 0)} {config.tokenName}
    </Button>
  );
}
