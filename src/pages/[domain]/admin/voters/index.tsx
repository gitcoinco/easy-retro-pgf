import { useState } from "react";
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
import { NumberInput } from "~/components/NumberInput";

export default function AdminAccountsPage() {
  const [isOpen, setOpen] = useState(false);

  const update = useUpdateRound();
  const { data } = useVoters();
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

  const voters = data?.map((v) => v.recipient) ?? [];
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
                      alert("Revoking of attestations not implemented yet");
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
              <AddressList addresses={voters} />
            </Form>
          </FormSection>
        </>
      )}
    </RoundAdminLayout>
  );
}
