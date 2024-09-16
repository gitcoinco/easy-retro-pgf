import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Table, Td, Tr } from "~/components/ui/Table";
import { useImportVoters } from "~/features/voters/hooks/useImportVoters";
import { api } from "~/utils/api";

export function ImportVotersCSV() {
  const [file, setFile] = useState<File | null>(null);
  const importVoters = useImportVoters();
  const voters = api.voters.voteCounts.useQuery();

  const handleFileChange = (event: React.ChangeEvent) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <Button
        onClick={() => file && importVoters.mutateAsync(file)}
        disabled={!file || importVoters.isPending}
        isLoading={importVoters.isPending}
      >
        Import Voters
      </Button>
      <Table>
        {voters.data?.map((voter) => (
          <Tr key={voter.id} className="flex justify-between font-mono">
            <Td>{voter.voterId}</Td>
            <Td>
              {voter.maxVotesProject} / {voter.maxVotesTotal}
            </Td>
          </Tr>
        ))}
      </Table>
    </div>
  );
}
