import { useCallback } from "react";
import { Button } from "~/components/ui/Button";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";
import { format } from "~/utils/csv";

export const ExportVotes = (props: { totalVotes: string }) => {
  const { mutateAsync, isPending } = api.ballot.export.useMutation();
  const round = useCurrentRound();
  const roundType = round.data?.type;
  let columns: string[] = [];
  if (roundType === "project") {
    columns = [
      "voterId",
      "signature",
      "publishedAt",
      "project",
      "amount",
      "id",
    ];
  } else if (roundType === "impact") {
    columns = ["voterId", "signature", "publishedAt", "amount", "id"];
  }
  const exportCSV = useCallback(async () => {
    const ballots = await mutateAsync();
    // Generate CSV file
    const csv = format(ballots, {
      columns: columns,
    });
    window.open(`data:text/csv;charset=utf-8,${csv}`);
  }, [mutateAsync]);

  return (
    <Button variant="outline" isLoading={isPending} onClick={exportCSV}>
      Download votes
    </Button>
  );
};
