import { Form, FormControl, FormSection } from "~/components/ui/Form";
import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";
import { Button } from "~/components/ui/Button";
import { RoundDatesSchema, type RoundSchema } from "~/features/rounds/types";
import { DatePicker } from "~/components/ui/DatePicker";
import { useUpdateRound } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";
import { CheckIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { cn } from "~/utils/classNames";
import { format, isAfter } from "date-fns";

export default function AdminPhasesPage() {
  return (
    <RoundAdminLayout className="max-w-screen-md">
      {({ data }) => <RoundForm round={data} />}
    </RoundAdminLayout>
  );
}

function RoundForm({ round }: { round: RoundSchema }) {
  const utils = api.useUtils();
  const update = useUpdateRound();
  return (
    <Form
      defaultValues={{ ...round }}
      schema={RoundDatesSchema}
      onSubmit={(values) => {
        const startDateHasPassed = isAfter(
          new Date(),
          round.startsAt ?? new Date(),
        );
        if (
          startDateHasPassed &&
          !window.confirm("Are you sure? The round has already started.")
        ) {
          return;
        }
        update.mutate(values, {
          async onSuccess() {
            return utils.rounds.invalidate();
          },
        });
      }}
    >
      <FormSection
        title="Round dates"
        description="Configure the dates for the application and voting periods."
      >
        <ol className="relative border-s pl-6">
          <DateFormItem
            name="startsAt"
            label="Registration starts"
            description="Projects can submit their applications"
          />
          <DateFormItem
            name="reviewAt"
            label="Review & Approval starts"
            description="Projects can register up until this point"
          />
          <DateFormItem
            name="votingAt"
            label="Voting starts"
            description="Voters can start voting for projects"
          />
          <DateFormItem
            name="resultAt"
            label="Voting ends"
            description="Voting closes"
          />
          <DateFormItem
            name="payoutAt"
            label="Payout"
            description="Distribution of tokens to the projects"
          />
        </ol>

        <div className="flex justify-end">
          <Button variant="primary" type="submit" isLoading={update.isPending}>
            Save round
          </Button>
        </div>
      </FormSection>
    </Form>
  );
}

function DateFormItem({
  name,
  label,
  description,
}: {
  name: string;
  label: string;
  description?: string;
}) {
  const isSet = Boolean(useFormContext().watch(name));
  return (
    <div className="mb-8">
      <div
        className={cn(
          "absolute -start-2 mt-1 flex  size-4 items-center justify-center rounded-lg",
          {
            ["bg-gray-200 text-gray-800"]: !isSet,
            ["bg-green-200 text-green-800"]: isSet,
          },
        )}
      >
        {isSet && <CheckIcon className="size-3" />}
      </div>
      <FormControl name={name} label={label} hint={description}>
        <DatePicker name={name} />
      </FormControl>
    </div>
  );
}
