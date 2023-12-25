import { z } from "zod";
import { useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/Button";
import { Checkbox, Form } from "~/components/ui/Form";
import { Markdown } from "~/components/ui/Markdown";
import { Spinner } from "~/components/ui/Spinner";
import { useMetadata } from "~/hooks/useMetadata";
import { Layout } from "~/layouts/DefaultLayout";
import { api } from "~/utils/api";
import { useAttest } from "~/hooks/useEAS";
import { useMutation } from "@tanstack/react-query";
import { createAttestation } from "~/lib/eas/createAttestation";
import { eas } from "~/config";
import { useEthersSigner } from "~/hooks/useEthersSigner";

function useApplications() {
  return api.applications.list.useQuery({});
}

type MetadataAttestation = {
  id: string;
  attester: Address;
  metadataPtr: string;
};
function ApplicationItem({ id, attester, metadataPtr }: MetadataAttestation) {
  const metadata = useMetadata(metadataPtr);

  const form = useFormContext();

  return (
    <div className="flex items-center gap-2 rounded border-b dark:border-gray-800 hover:dark:bg-gray-800">
      <label className="flex flex-1 cursor-pointer items-center gap-2 p-2">
        <Checkbox {...form.register(id)} type="checkbox" />

        <div>{metadata.data?.name}</div>
      </label>
      <Button variant="ghost">Open</Button>
    </div>
  );
}

function useApprove() {
  const attest = useAttest();
  const signer = useEthersSigner();

  return useMutation(async (applicationIds: string[]) => {
    if (!signer) throw new Error("Connect wallet first");
    const attestations = await Promise.all(
      applicationIds.map((refUID) =>
        createAttestation(
          { values: { note: "" }, schemaUID: eas.schemas.approval, refUID },
          signer,
        ),
      ),
    );
    return attest.mutateAsync(
      attestations.map((att) => ({ ...att, data: [att.data] })),
    );
  });
}

function Applications() {
  const applications = useApplications();

  const approve = useApprove();
  return (
    <Form
      schema={z.record(z.boolean())}
      onSubmit={(values) => {
        console.log("approve", values);
        const selected = Object.keys(values).filter((key) => values[key]);
        console.log("selected", selected);

        approve.mutate(selected);
      }}
    >
      <Markdown>{`### Review applications
Select the applications you want to approve.
      `}</Markdown>

      <div className="mb-2 flex justify-end">
        <ApproveButton />
      </div>

      {applications.isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Spinner />
        </div>
      ) : !applications.data?.length ? (
        <div>No applications found</div>
      ) : null}
      {applications.data?.map((item) => (
        <ApplicationItem key={item.id} {...item} />
      ))}
    </Form>
  );
}
function ApproveButton() {
  const form = useFormContext();
  const selectedCount = Object.values(form.watch()).filter(Boolean).length;
  return (
    <Button disabled={!selectedCount} variant="primary" type="submit">
      Approve {selectedCount} applications
    </Button>
  );
}

export default function ApplicationsPage() {
  return (
    <Layout>
      <Applications />
    </Layout>
  );
}
