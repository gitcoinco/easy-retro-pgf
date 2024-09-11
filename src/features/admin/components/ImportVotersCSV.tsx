import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { useImportVoters } from "~/features/voters/hooks/useImportVoters";

export function ImportVotersCSV() {
  const [file, setFile] = useState<File | null>(null);
  const importVoters = useImportVoters();

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
    </div>
  );
}
