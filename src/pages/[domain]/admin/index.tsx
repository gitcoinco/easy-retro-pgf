import {
  Form,
  FormControl,
  FormSection,
  Input,
  InputWithAddon,
  Select,
  Textarea,
} from "~/components/ui/Form";
import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";
import { Button } from "~/components/ui/Button";
import { RoundSchema } from "~/features/rounds/types";
import { DatePicker } from "~/components/ui/DatePicker";
import { supportedNetworks } from "~/config";
import { useUpdateRound } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { TokenSymbol } from "~/features/admin/components/FormTokenSymbol";
import { createComponent } from "~/components/ui";
import { tv } from "tailwind-variants";
import { PropsWithChildren } from "react";
import { CheckIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { cn } from "~/utils/classNames";

export default function AdminPage() {
  return (
    <RoundAdminLayout className="max-w-screen-md">
      {({ data }) => <RoundForm round={data!} />}
    </RoundAdminLayout>
  );
}

function RoundForm({ round }: { round: RoundSchema }) {
  const utils = api.useUtils();
  const router = useRouter();
  const update = useUpdateRound();
  return (
    <Form
      defaultValues={{ ...round }}
      onSubmit={(values) => {
        update.mutate(values, {
          async onSuccess({ domain }) {
            if (domain !== round.domain) router.push(`/${domain}/admin`);
            return utils.rounds.invalidate();
          },
        });
      }}
      schema={RoundSchema}
    >
      <FormSection
        title="Round details"
        description="Fill out the details about your your round. You can change most of these at any time."
      >
        <FormControl name="name" label="Name">
          <Input />
        </FormControl>

        <FormControl className="flex-1" name="domain" label="Round URL">
          <InputWithAddon addon="https://easy-retro-pgf.vercel.app/" />
        </FormControl>

        <FormControl name="description" label="Description">
          <Textarea rows={8} />
        </FormControl>
        <div className="gap-2 sm:flex">
          <FormControl
            className="flex-1"
            name="network"
            label="Network"
            hint="EVM-based chain for payouts and EAS attestations"
          >
            <Select className={"w-full"}>
              <option value="">Select a network</option>
              {supportedNetworks.map((network) => {
                return (
                  <option key={network.id} value={network.chain}>
                    {network.name}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            className="flex-1"
            name="tokenAddress"
            label="Token address"
            hint={<TokenSymbol />}
          >
            <Input placeholder="0x..." />
          </FormControl>
        </div>
      </FormSection>

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
          <DateFormItem name="startsAt" label="Voting starts" />
          <DateFormItem name="resultAt" label="Voting ends" />
          <DateFormItem
            name="payoutAt"
            label="Payout"
            description="Distribution of tokens to the projects"
          />
        </ol>

        <div className="flex justify-end">
          <Button variant="primary" type="submit" isLoading={update.isLoading}>
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
          "absolute -start-2 mt-1 flex  size-4 items-center justify-center rounded-full",
          {
            ["bg-gray-200 text-gray-800"]: !isSet,
            ["bg-green-200 text-green-800"]: isSet,
          },
        )}
      >
        {isSet && <CheckIcon className="size-3" />}
      </div>
      {/* <div className="absolute -start-2 mt-1 size-4 rounded-full border border-white bg-gray-200" /> */}
      <FormControl name={name} label={label} hint={description}>
        <DatePicker name={name} />
      </FormControl>
    </div>
  );
}
