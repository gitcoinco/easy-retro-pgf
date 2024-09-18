import { FileUp } from "lucide-react";
import { useCallback } from "react";
import { IconButton } from "~/components/ui/Button";
import { type Distribution } from "~/features/distribute/types";
import { useProjectsById } from "~/features/projects/hooks/useProjects";
import { format } from "~/utils/csv";

export function ExportCSV({ votes }: { votes: Distribution[] }) {
  // Fetch projects for votes to get the name
  // const projects = useProjectsById(votes.map((v) => v.projectId));

  const exportCSV = useCallback(async () => {
    // Append project name to votes
    const votesWithProjects = votes.map((vote) => ({
      ...vote,
      // name: projects.data?.find((p) => p.id === vote.projectId)?.name,
    }));

    // Generate CSV file
    const csv = format(votesWithProjects, {
      columns: ["projectId", "name", "payoutAddress", "amount", "amountPercentage"],
    });

    window.open(`data:text/csv;charset=utf-8,${csv}`);
  }, [votes]);

  return (
    <IconButton type="button" icon={FileUp} onClick={exportCSV}>
      Export CSV
    </IconButton>
  );
}
