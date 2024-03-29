import { useController, useFormContext } from "react-hook-form";
import { useAccount } from "wagmi";
import { useLocalStorage } from "react-use";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  Input,
  Textarea,
  Label,
} from "~/components/ui/Form";
import { IconButton } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";

import { Tag } from "~/components/ui/Tag";
import { impactCategories } from "~/config";
import { useCreateList } from "../hooks/useCreateList";
import { Alert } from "~/components/ui/Alert";
import { ListSchema } from "../types";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { Spinner } from "~/components/ui/Spinner";
import { AllocationFormWithSearch } from "~/components/AllocationList";
import { formatNumber } from "~/utils/formatNumber";
import { sumBallot } from "~/features/ballot/hooks/useBallot";
import { type Vote } from "~/features/ballot/types";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

const ListTags = () => {
  const { control, watch } = useFormContext();
  const { field } = useController({ name: "impactCategory", control });

  const selected = (watch("impactCategory") ?? []) as string[];

  return (
    <div className="mb-4">
      <Label>
        Impact categories<span className="text-red-300">*</span>
      </Label>
      <div className="flex flex-wrap gap-1">
        {Object.entries(impactCategories).map(([value, { label }]) => {
          const isSelected = selected.includes(value);
          return (
            <Tag
              size="lg"
              selected={isSelected}
              key={value}
              onClick={() => {
                field.onChange([value]);
              }}
            >
              {label}
            </Tag>
          );
        })}
      </div>
    </div>
  );
};

const createListErrors = {
  ACTION_REJECTED: "User rejected transaction",
};
export function ListForm() {
  const clearDraft = useLocalStorage("list-draft")[2];

  const create = useCreateList({
    onSuccess: () => {
      toast.success("List created successfully!");
      clearDraft();
    },
    onError: (err: { reason?: string; data?: { message: string } }) =>
      toast.error("List create error", {
        description: err.reason ?? err.data?.message,
      }),
  });
  if (create.isSuccess) {
    return <Alert variant="success" title="List created!"></Alert>;
  }

  const error = create.error as {
    reason?: string;
    data?: { message: string };
  };

  return (
    <Form
      persist="list-draft"
      schema={ListSchema}
      onSubmit={async (values) => {
        console.log(values);
        create.mutate(values);
      }}
    >
      <fieldset disabled={create.isLoading}>
        <FormControl name="name" label="List name" required>
          <Input autoFocus placeholder="Give your list a name..." />
        </FormControl>
        <FormControl name="description" label="Description" required>
          <Textarea rows={4} placeholder="What's this list about?" />
        </FormControl>
        <ListTags />
        <FormControl
          name="impact.description"
          label="Impact evaluation"
          required
        >
          <Textarea
            rows={4}
            placeholder="How did you evaluate the impact of projects? Help other badgeholders understand your methodology."
          />
        </FormControl>
        <FormControl name="impact.url" label="Link to relevant resource">
          <Input placeholder="https://" />
        </FormControl>

        <div className="mb-4 rounded-2xl border border-neutral-300 p-6">
          <AllocationFormWithSearch />
          <TotalAllocation />
          {/*
           */}
        </div>

        <CreateListButton
          isLoading={create.isLoading}
          buttonText={
            create.isAttesting ? "Creating attestation" : "Create list"
          }
        />

        {error && (
          <div className="text-center text-gray-600">
            Make sure you&apos;re not connected to a VPN since this can cause
            problems with the RPC and your wallet.
          </div>
        )}

        <Dialog size="sm" isOpen={create.isLoading}>
          <Alert variant="info">
            <div className="font-semibold">Your list is being created...</div>
          </Alert>
        </Dialog>
      </fieldset>
    </Form>
  );
}

function CreateListButton({
  isLoading,
  buttonText,
}: {
  isLoading: boolean;
  buttonText: string;
}) {
  const { isConnected } = useAccount();
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();

  const {
    formState: { isValid },
  } = useFormContext();

  console.log({ isValid });
  return (
    <div className="flex items-center justify-between">
      <div>
        {!isConnected && <div>You must connect wallet to create a list</div>}
        {!isCorrectNetwork && (
          <div className="flex items-center gap-2">
            You must be connected to {correctNetwork?.name}
          </div>
        )}
      </div>

      <IconButton
        icon={isLoading ? Spinner : null}
        disabled={!isValid || isLoading || !isConnected || !isCorrectNetwork}
        variant="primary"
        type="submit"
        isLoading={isLoading}
      >
        {buttonText}
      </IconButton>
    </div>
  );
}

function TotalAllocation() {
  const form = useFormContext();
  const round = useCurrentRound();
  const projects = (form.watch("projects") ?? []) as Vote[];
  const current = sumBallot(projects);

  const exceeds = current - (round.data?.maxVotesTotal ?? 0);
  const isExceeding = exceeds > 0;
  return (
    <Alert className="mb-6" variant={isExceeding ? "warning" : "info"}>
      <div className={"flex justify-between font-semibold"}>
        <div>
          {isExceeding
            ? `Total exceeds by ${formatNumber(exceeds)} OP`
            : "Total"}
        </div>
        <div>{formatNumber(current)} votes</div>
      </div>
    </Alert>
  );
}
