import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Alert } from "~/components/ui/Alert";
import { Button } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";
import { Form } from "~/components/ui/Form";
import { Spinner } from "~/components/ui/Spinner";
import { AllocationForm } from "~/features/ballot/components/AllocationList";
import {
  useBallot,
  sumBallot,
  useSaveBallot,
} from "~/features/ballot/hooks/useBallot";
import { BallotSchema, type Vote } from "~/features/ballot/types";
import { Layout } from "~/layouts/DefaultLayout";
import { formatNumber } from "~/utils/formatNumber";

export default function BallotPage() {
  const { data: ballot, isLoading } = useBallot();

  if (isLoading) return null;

  const votes = ballot?.votes.sort((a, b) => b.amount - a.amount);
  return (
    <Layout sidebar="right" requireAuth>
      {isLoading ? null : (
        <Form
          schema={BallotSchema}
          defaultValues={{ votes }}
          onSubmit={console.log}
        >
          <BallotAllocationForm />
        </Form>
      )}
      <div className="py-8" />
    </Layout>
  );
}

function BallotAllocationForm() {
  const form = useFormContext<{ votes: Vote[] }>();

  const save = useSaveBallot();

  const votes = form.watch("votes");
  function handleSaveBallot({ votes }: { votes: Vote[] }) {
    save.mutate({ votes });
  }

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
      <div className="mb-2 flex justify-end">
        {votes.length ? <ClearBallot /> : null}
      </div>
      <div className="relative rounded-2xl border border-gray-300 dark:border-gray-800">
        <div className="p-8">
          <div className="relative flex max-h-[500px] min-h-[360px] flex-col overflow-auto">
            {votes?.length ? (
              <AllocationForm onSave={handleSaveBallot} />
            ) : (
              <EmptyBallot />
            )}
          </div>
        </div>

        <div className="flex h-16 items-center justify-between rounded-b-2xl border-t border-gray-300 px-8 py-4 text-lg font-semibold dark:border-gray-800">
          <div>Total votes in ballot</div>
          <div className="flex items-center gap-2">
            {save.isLoading && <Spinner />}
            <TotalAllocation />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClearBallot() {
  const [isOpen, setOpen] = useState(false);
  const { mutate, isLoading } = useSaveBallot({
    onSuccess: () => setOpen(false),
  });
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Remove all projects from ballot
      </Button>
      <Dialog title="Are you sure?" isOpen={isOpen}>
        <p className="leading-6">
          This will empty your ballot and remove all the projects you have
          added.
        </p>
        <div className="flex justify-end">
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={() => mutate({ votes: [] })}
          >
            {isLoading ? <Spinner className="h-4 w-4" /> : "Yes I'm sure"}
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
        through the available projects and lists.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" as={Link} href={"/projects"}>
          View projects
        </Button>
        <div className="text-gray-700">or</div>
        <Button variant="outline" as={Link} href={"/lists"}>
          View lists
        </Button>
      </div>
    </div>
  </div>
);

const TotalAllocation = () => {
  const form = useFormContext<{ votes: Vote[] }>();
  const votes = form.watch("votes") ?? [];
  const sum = sumBallot(votes);

  return <div>{formatNumber(sum)} OP</div>;
};
