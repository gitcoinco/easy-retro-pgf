import { z } from "zod";
import { Button } from "~/components/ui/Button";
import { Form, FormControl, FormSection, Input } from "~/components/ui/Form";
import { ConnectButton } from "~/components/ConnectButton";
import { BaseLayout } from "~/layouts/BaseLayout";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { RoundNameSchema } from "~/features/rounds/types";
import { useSessionAddress } from "~/hooks/useSessionAddress";

export default function CreateRoundPage() {
  return (
    <BaseLayout>
      <div className="mx-auto max-w-sm">
        <CreateRound />
      </div>
    </BaseLayout>
  );
}

function CreateRound() {
  const router = useRouter();
  const { address } = useSessionAddress();

  const create = api.rounds.create.useMutation();

  return (
    <>
      <div className="mb-2">
        {!address && (
          <div>
            <div className="mb-2 text-center">
              You must connect your wallet to create a round
            </div>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        )}
      </div>
      <Form
        onSubmit={(values) =>
          create.mutate(values, {
            async onSuccess(round) {
              await router.push(`/${round?.domain}/admin`);
            },
          })
        }
        schema={z.object({ name: RoundNameSchema })}
      >
        <FormSection
          title="Create a new round"
          description="Enter a name for your round to get started."
        >
          <FormControl name="name" label="Round name">
            <Input placeholder="My New Round" />
          </FormControl>
          <FormControl name="admin" label="Round owner">
            <Input value={address} readOnly />
          </FormControl>
          <Button
            className="w-full"
            type="submit"
            variant="primary"
            disabled={!address || create.isPending}
            isLoading={create.isPending}
          >
            {create.isPending ? "Creating..." : "Create round"}
          </Button>

          {create.error?.message.includes("Unique constraint") &&
            "A round with this name already exists."}
        </FormSection>
      </Form>
    </>
  );
}
