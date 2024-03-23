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
        <div className="gap-2 sm:flex">
          <FormControl
            className="flex-1"
            name="startsAt"
            label="Registration starts"
          >
            <DatePicker name="startsAt" />
          </FormControl>
          <FormControl
            className="flex-1"
            name="registrationEndsAt"
            label="Registration ends"
          >
            <DatePicker name="registrationEndsAt" />
          </FormControl>
          <FormControl
            className="flex-1"
            name="reviewEndsAt"
            label="Review & Approval ends"
          >
            <DatePicker name="reviewEndsAt" />
          </FormControl>
        </div>

        <div className="gap-2 sm:flex">
          <FormControl
            className="flex-1"
            name="reviewEndsAt"
            label="Voting starts"
          >
            <DatePicker name="reviewEndsAt" />
          </FormControl>
          <FormControl className="flex-1" name="resultsAt" label="Voting ends">
            <DatePicker name="resultsAt" />
          </FormControl>
          <FormControl
            className="flex-1"
            name="distributionAt"
            label="Distribution of tokens"
          >
            <DatePicker name="distributionAt" />
          </FormControl>
        </div>
        <div className="flex justify-end">
          <Button variant="primary" type="submit" isLoading={update.isLoading}>
            Save round
          </Button>
        </div>
      </FormSection>
    </Form>
  );
}
