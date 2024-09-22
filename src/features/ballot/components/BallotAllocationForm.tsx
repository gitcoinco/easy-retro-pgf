import { AlertCircle, FileDown, FileUp } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Alert } from "~/components/ui/Alert";
import { Button, IconButton } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import { Spinner } from "~/components/ui/Spinner";
import { AllocationForm } from "~/components/AllocationList";
import { sumBallot, useSaveBallot } from "~/features/ballot/hooks/useBallot";
import { type Vote } from "~/features/ballot/types";
import { useProjectsById } from "~/features/projects/hooks/useProjects";
import { parse, format } from "~/utils/csv";
import { formatNumber } from "~/utils/formatNumber";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";

export function BallotAllocationForm({ isPublished = false }) {
  const form = useFormContext<{ votes: Vote[] }>();

  const save = useSaveBallot();

  const votes = form.watch("votes");
  function handleSaveBallot({ votes }: { votes: Vote[] }) {
    const quadraticAmounts = votes.map((vote) => { return { ...vote, amount: vote.amount ** 2 } });
    save.mutate({ votes: quadraticAmounts });
  }

  const roundState = useRoundState();
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Review your ballot</h1>
      <p className="mb-6">
        Once you have reviewed your vote allocation, you can submit your ballot.
      </p>
      {save.error && (
        <Alert
          icon={AlertCircle}
          title={save.error?.message}
          className="mb-4"
          variant="warning"
        ></Alert>
      )}
      <div className="mb-2 justify-between sm:flex">
        <div className="flex gap-2">
          <ImportCSV />
          <ExportCSV votes={votes} />
        </div>
        {votes.length ? <ClearBallot /> : null}
      </div>
      <div className="relative rounded-2xl border border-gray-300 dark:border-gray-800">
        <div className="p-8">
          <div className="relative flex max-h-[500px] min-h-[360px] flex-col overflow-auto">
            {votes?.length ? (
              <AllocationForm
                disabled={isPublished || roundState !== "VOTING"}
                onSave={handleSaveBallot}
              />
            ) : (
              <EmptyBallot />
            )}
          </div>
        </div>

        <div className="flex h-16 items-center justify-between rounded-b-2xl border-t border-gray-300 px-8 py-4 text-lg font-semibold dark:border-gray-800">
          <div>Total votes in ballot</div>
          <div className="flex items-center gap-2">
            {save.isPending && <Spinner />}
            <TotalAllocation />
          </div>
        </div>
      </div>
    </div>
  );
}

function ImportCSV() {
  const form = useFormContext();
  const [votes, setVotes] = useState<Vote[]>([]);
  const save = useSaveBallot();
  const csvInputRef = useRef<HTMLInputElement>(null);

  const importCSV = useCallback((csvString: string) => {
    // Parse CSV and build the ballot data (remove name column)
    const { data } = parse<Vote>(csvString);
    const votes = data.map(({ projectId, amount }) => ({
      projectId,
      amount: Number(amount),
    }));
    console.log(123, votes);
    setVotes(votes);
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
        isOpen={votes.length > 0}
        onOpenChange={() => setVotes([])}
      >
        <p className="mb-6 leading-6">
          This will replace your ballot with the CSV.
        </p>
        <div className="flex justify-end">
          <Button
            variant="primary"
            disabled={save.isPending}
            onClick={() => {
              const quadraticAmounts = votes.map((vote) => { return { ...vote, amount: vote.amount ** 2 } });
              save
                .mutateAsync({ votes: quadraticAmounts })
                .then(() => form.reset({ votes }))
                .catch(console.log);
              setVotes([]);
            }}
          >
            Yes I'm sure
          </Button>
        </div>
      </Dialog>
    </>
  );
}

function ExportCSV({ votes }: { votes: Vote[] }) {
  // Fetch projects for votes to get the name
  const projects = useProjectsById(votes.map((v) => v.projectId));

  const exportCSV = useCallback(async () => {
    // Append project name to votes
    const votesWithProjects = votes.map((vote) => ({
      ...vote,
      name: projects.data?.find((p) => p.id === vote.projectId)?.name,
    }));

    // Generate CSV file
    const csv = format(votesWithProjects, {
      columns: ["projectId", "name", "amount"],
    });
    window.open(`data:text/csv;charset=utf-8,${csv}`);
  }, [projects, votes]);

  return (
    <IconButton size="sm" icon={FileDown} onClick={exportCSV}>
      Export CSV
    </IconButton>
  );
}

function ClearBallot() {
  const form = useFormContext();
  const [isOpen, setOpen] = useState(false);
  const { mutateAsync, isPending } = useSaveBallot();

  const roundState = useRoundState();
  if (["TALLYING", "RESULTS"].includes(roundState!)) return null;

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Remove all projects from ballot
      </Button>

      <Dialog
        title="Are you sure?"
        size="sm"
        isOpen={isOpen}
        onOpenChange={setOpen}
      >
        <p className="mb-6 leading-6">
          This will empty your ballot and remove all the projects you have
          added.
        </p>
        <div className="flex justify-end">
          <Button
            variant="primary"
            disabled={isPending}
            onClick={() =>
              mutateAsync({ votes: [] }).then(() => {
                setOpen(false);
                form.reset({ votes: [] });
              })
            }
          >
            {isPending ? <Spinner /> : "Yes I'm sure"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}

const EmptyBallot = () => (
  <div className="flex flex-1 items-center justify-center">
    <div className=" max-w-[360px] space-y-4">
      <h3 className="text-center text-lg font-bold">Your ballot is empty</h3>
      <p className="text-center text-sm text-gray-700">
        Your ballot currently doesn&apos;t have any projects added. Browse
        through the available projects.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button as={Link} href={"/projects"}>
          View projects
        </Button>
      </div>
    </div>
  </div>
);

const TotalAllocation = () => {
  const form = useFormContext<{ votes: Vote[] }>();
  const votes = form.watch("votes") ?? [];
  const sum = sumBallot(votes);

  return <div>{formatNumber(sum)} votes</div>;
};
