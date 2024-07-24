import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/Button";
import { Form, FormControl, FormSection } from "~/components/ui/Form";
import {
  AddAddressesModal,
  AddressList,
  AddressSchema,
  DeleteSelectedButton,
  SelectAllButton,
} from "~/features/admin/components/AddAddresses";
import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";

import {
  useApproveVoters,
  useVoters,
} from "~/features/voters/hooks/useApproveVoters";
import { RoundVotesSchema } from "~/features/rounds/types";
import { NumberInput } from "~/components/NumberInput";
import { useUpdateRound } from "~/features/rounds/hooks/useRound";
import { Alert } from "~/components/ui/Alert";
import { useRevokeAttestations } from "~/hooks/useRevokeAttestations";
import { useAccount } from "wagmi";

export default function AdminAccountsPage() {
  const [isOpen, setOpen] = useState(false);
  const { address } = useAccount();
  const update = useUpdateRound();
  const { data: voterList } = useVoters();
  const approve = useApproveVoters({
    onSuccess: () => {
      toast.success("Voters approved successfully!");
      setOpen(false);
    },
    onError: (err: { reason?: string; data?: { message: string } }) =>
      toast.error("Voter approve error", {
        description: err.reason ?? err.data?.message,
      }),
  });

  const revoke = useRevokeAttestations({});

  const voters = voterList?.map((v) => v.recipient) ?? [];

  const attestedByOthers = useMemo(
    () =>
      voterList
        ?.filter((voter) => voter.attester !== address)
        .map((voter) => voter.recipient),
    [voterList],
  );
  return (
    <RoundAdminLayout title="Manage voters" className="max-w-screen-md">
      {({ data }) => (
        <>
          <FormSection
            title="Vote settings"
            description="Configure vote settings and eligible voters in your round."
          >
            <Form
              defaultValues={{
                maxVotesProject: data?.maxVotesProject,
                maxVotesTotal: data?.maxVotesTotal,
              }}
              schema={RoundVotesSchema}
              onSubmit={(values) => update.mutate({ id: data?.id, ...values })}
            >
              <div className="flex gap-2">
                <FormControl
                  className="flex-1"
                  name="maxVotesProject"
                  label="Max votes for each project"
                >
                  <NumberInput />
                </FormControl>
                <FormControl
                  className="flex-1"
                  name="maxVotesTotal"
                  label="Max votes per voter"
                >
                  <NumberInput />
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
            title="Approved voters"
            description="Add voter addresses to allow them to participate in voting."
          >
            <Alert variant="info" className={"mb-2"}>
              Added voters can take 10 minutes to show up.
            </Alert>
            <Form
              defaultValues={{ selected: [] }}
              schema={AddressSchema}
              onSubmit={console.log}
            >
              <div className="mb-2 flex items-center justify-between">
                <Button variant="primary" onClick={() => setOpen(true)}>
                  Add voters
                </Button>
                <div className="flex gap-2">
                  <SelectAllButton addresses={voters} />
                  <DeleteSelectedButton
                    onDelete={(removed) => {
                      // Find the attestation IDs for the addresses
                      const attestations = removed
                        .map((addr) =>
                          voterList?.find((voter) => voter.recipient === addr),
                        )
                        .map((v) => v?.id)
                        .filter(Boolean) as string[];

                      revoke.mutate(attestations);
                    }}
                  />
                </div>
              </div>
              <AddAddressesModal
                title="Add voters"
                description="Provide addresses to add as voters to the round."
                isOpen={isOpen}
                isLoading={approve.isPending}
                onOpenChange={() => setOpen(false)}
                onSubmit={(voters) => {
                  approve.mutate(voters);
                }}
              />
              <AddressList addresses={voters} disabled={attestedByOthers} />
            </Form>
          </FormSection>
        </>
      )}
    </RoundAdminLayout>
  );
}
