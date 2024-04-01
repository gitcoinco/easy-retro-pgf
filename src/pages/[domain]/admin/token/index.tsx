import { Button } from "~/components/ui/Button";
import {
  Form,
  FormControl,
  FormSection,
  Input,
  Select,
} from "~/components/ui/Form";
import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";
import CreatePool from "~/features/distribute/components/CreatePool";
import { useUpdateRound } from "~/features/rounds/hooks/useRound";
import { RoundSchema } from "~/features/rounds/types";
import { supportedNetworks } from "~/config";
import { api } from "~/utils/api";
import { TokenSymbol } from "~/features/admin/components/FormTokenSymbol";
import { isAfter } from "date-fns";

export default function AdminTokenPage() {
  const utils = api.useUtils();
  const update = useUpdateRound();
  return (
    <RoundAdminLayout title="Manage round token" className="max-w-screen-md">
      {({ data }) => (
        <>
          <FormSection
            title="Token & Payout"
            description="Configure the payout token and vote calculations. Only change the network before applications are registered."
          >
            <Form
              defaultValues={{
                network: data?.network,
                tokenAddress: data?.tokenAddress,
              }}
              schema={RoundSchema.partial()}
              onSubmit={(values) => {
                const startDateHasPassed = isAfter(
                  new Date(),
                  data?.startsAt ?? new Date(),
                );
                if (
                  startDateHasPassed &&
                  values.network !== data?.network &&
                  !window.confirm(
                    "Are you sure?\n\nChanging network in the middle of the round might cause issues.",
                  )
                ) {
                }
                update.mutate(
                  { id: data?.id, ...values },
                  {
                    async onSuccess() {
                      return utils.rounds.invalidate();
                    },
                  },
                );
              }}
            >
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
                <Button
                  isLoading={update.isPending}
                  type="submit"
                  variant="primary"
                  className={"mt-6 w-24"}
                >
                  Save
                </Button>
              </div>
            </Form>
          </FormSection>
          <FormSection
            title="Configure Pool"
            description="Create and fund the pool with tokens. These will be distributed to the projects from the Distribute page."
          >
            <div className="max-w-sm">
              <CreatePool />
            </div>
          </FormSection>
        </>
      )}
    </RoundAdminLayout>
  );
}
