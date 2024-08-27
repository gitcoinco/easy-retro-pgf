import { FileDown } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button, IconButton } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import { parse } from "~/utils/csv";
import { type Distribution } from "../types";
import { getAddress } from "viem";
import { toast } from "sonner";

export function ImportCSV({
  onImport,
}: {
  onImport: (distribution: Distribution[]) => void;
}) {
  const [distribution, setDistribution] = useState<Distribution[]>([]);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const importCSV = useCallback((csvString: string) => {
    try {
      // Parse CSV and build the ballot data (remove name column)
      const { data } = parse<Distribution>(csvString);
      const distribution = data
        .filter((d) => d.projectId !== "" && d.payoutAddress !== "")
        .map(({ projectId, name, amountPercentage, payoutAddress }) => ({
          projectId,
          name,
          payoutAddress: getAddress(payoutAddress),
          amountPercentage: Number(amountPercentage),
        }));
      const totalPercentage = distribution.reduce(
        (acc, d) => acc + d.amountPercentage,
        0,
      );
      if (totalPercentage < 99.99 || totalPercentage > 100) {
        toast.error(
          `Amount percentage should sum to 100%. Current sum is ${totalPercentage}%`,
        );
      } else {
        setDistribution(distribution);
      }
    } catch (error) {
      toast.error((error as unknown as Error).message);
    }
  }, []);
  return (
    <div>
      <IconButton icon={FileDown} onClick={() => csvInputRef.current?.click()}>
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
        isOpen={distribution.length > 0}
        size="sm"
        title="Import distribution?"
        onOpenChange={() => setDistribution([])}
      >
        <p className="mb-6 leading-6">
          This will replace your distribution with the CSV. Refreshing the page
          will reset the distribution.
        </p>
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={() => {
              onImport(distribution);
              setDistribution([]);
            }}
          >
            Yes I'm sure
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
