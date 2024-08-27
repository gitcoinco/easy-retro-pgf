import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Form, FormSection } from "~/components/ui/Form";
import {
  AddAddressesModal,
  AddressSchema,
  DeleteSelectedButton,
  SelectAllButton,
} from "~/features/admin/components/AddAddresses";
import { AddressList } from "~/features/admin/components/AddressList";
import { RoundAdminLayout } from "~/features/admin/layouts/AdminLayout";
import { useUpdateRound } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";

export default function AdminAccountsPage() {
  const [isOpen, setOpen] = useState(false);

  const utils = api.useUtils();
  const update = useUpdateRound();

  return (
    <RoundAdminLayout title="Manage admin accounts" className="max-w-screen-md">
      {({ data }) => (
        <Form
          defaultValues={{ selected: [] }}
          schema={AddressSchema}
          onSubmit={console.log}
        >
          <FormSection
            title="Admin accounts"
            description="Manage admin accounts"
          >
            <div className="mb-2 flex items-center justify-between">
              <Button variant="primary" onClick={() => setOpen(true)}>
                Add admins
              </Button>
              <div className="flex gap-2">
                <SelectAllButton addresses={data?.admins} />
                <DeleteSelectedButton
                  onDelete={(removed) => {
                    const admins = data?.admins.filter(
                      (addr) => !removed.includes(addr),
                    );

                    update.mutate(
                      { id: data?.id, admins },
                      {
                        async onSuccess() {
                          return utils.rounds.invalidate();
                        },
                      },
                    );
                  }}
                />
              </div>
            </div>
            <AddAddressesModal
              title="Add admins"
              description="Provide addresses to grant admin access to the round."
              isOpen={isOpen}
              isLoading={update.isPending}
              onOpenChange={() => setOpen(false)}
              onSubmit={(added) => {
                // Merge with existing and only unique addresses
                const admins = [...new Set((data?.admins ?? []).concat(added))];

                update.mutate(
                  { id: data?.id, admins },
                  {
                    async onSuccess() {
                      setOpen(false);
                      return utils.rounds.invalidate();
                    },
                  },
                );
              }}
            />
            <AddressList
              addresses={data?.admins}
              disabled={data?.creatorId ? [data?.creatorId] : []}
            />
          </FormSection>
        </Form>
      )}
    </RoundAdminLayout>
  );
}
