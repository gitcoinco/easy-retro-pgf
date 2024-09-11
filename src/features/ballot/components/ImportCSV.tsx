import { FileDown, FileUp } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Button, IconButton } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import type { Allocation } from "~/features/ballot/types";
import { useProjectsById } from "~/features/projects/hooks/useProjects";
import { parse, format } from "~/utils/csv";
import { useSaveAllocation } from "../hooks/useBallot";
import { api } from "~/utils/api";
import { RoundTypes } from "~/features/rounds/types";

export function ImportCSV({
  onImport,
  roundType,
}: {
  onImport: (allocations: Allocation[]) => void;
  roundType: RoundTypes;
}) {
  const [rows, setRows] = useState<Allocation[]>([]);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const save = useSaveAllocation();
  const importCSV = useCallback((csvString: string) => {
    // Parse CSV and build the ballot data (remove name column)
    const { data } = parse<Allocation>(csvString);
    let totalAmount = 0;
    const rows = data.map(({ id, amount }) => {
      totalAmount += amount;
      return {
        id,
        amount,
        locked: true,
      };
    });
    if (roundType === RoundTypes.impact && totalAmount !== 100) {
      toast.error("Error importing CSV", {
        description: "Vote amounts must sum 100%",
        duration: 5000,
      });
    } else {
      setRows(rows);
    }
  }, []);

  return (
    <>
      <IconButton
        size="sm"
        icon={FileUp}
        onClick={() => csvInputRef.current?.click()}
      >
        Import CSV
      </IconButton>

      <input
        ref={csvInputRef}
        type="file"
        accept="*.csv"
        className="hidden"
        onChange={(e) => {
          const [file] = e.target.files ?? [];
          if (!file) return;
          // CSV parser doesn't seem to work with File
          // Read the CSV contents as string
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => importCSV(String(reader.result));
          reader.onerror = () => console.log(reader.error);
        }}
      />
      <Dialog
        size="sm"
        title="Save ballot?"
        isOpen={rows.length > 0}
        onOpenChange={() => setRows([])}
      >
        <p className="mb-6 leading-6">
          This will replace your ballot with the CSV.
        </p>
        <div className="flex justify-end">
          <Button
            variant="primary"
            disabled={save.isPending}
            onClick={() => {
              Promise.all(
                rows.map(({ id, amount, locked }) =>
                  save.mutateAsync({ id, amount, locked }),
                ),
              )
                .then(() => {
                  onImport(rows);
                  setRows([]);
                })
                .catch((error: Error) => {
                  toast.error("Error importing CSV", {
                    description: error.message,
                  });
                });
            }}
          >
            Yes I'm sure
          </Button>
        </div>
      </Dialog>
    </>
  );
}

export function ExportProjectsCSV({
  allocations = [],
}: {
  allocations?: Allocation[];
}) {
  // Fetch projects for allocations to get the name
  const projects = useProjectsById(allocations.map((v) => v.id));

  return <ExportCSV allocations={allocations} items={projects.data} />;
}

export function ExportMetricsCSV({
  allocations = [],
}: {
  allocations?: Allocation[];
}) {
  const metrics = api.metrics.get.useQuery({
    ids: allocations.map((v) => v.id),
  });
  return <ExportCSV allocations={allocations} items={metrics.data} />;
}

export function ExportCSV({
  allocations,
  items,
}: {
  allocations: Allocation[];
  items?: { id: string; name: string }[];
}) {
  const exportCSV = useCallback(async () => {
    // Append project name to allocations
    const allocationsWithNames = allocations.map((allocation) => ({
      ...allocation,
      name: items?.find((p) => p.id === allocation.id)?.name,
    }));

    // Generate CSV file
    const csv = format(allocationsWithNames, {
      columns: ["id", "name", "amount"],
    });
    window.open(`data:text/csv;charset=utf-8,${csv}`);
  }, [items, allocations]);

  return (
    <IconButton size="sm" icon={FileDown} onClick={exportCSV}>
      Export CSV
    </IconButton>
  );
}
