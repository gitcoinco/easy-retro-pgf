import { z } from "zod";
import { useFormContext } from "react-hook-form";
import * as Accordion from "@radix-ui/react-accordion";
import { Button, IconButton } from "~/components/ui/Button";
import { Checkbox, Form } from "~/components/ui/Form";
import { Markdown } from "~/components/ui/Markdown";
import { Spinner } from "~/components/ui/Spinner";
import { useMetadata } from "~/hooks/useMetadata";
import { api } from "~/utils/api";
import { useAttest } from "~/hooks/useEAS";
import { useMutation } from "@tanstack/react-query";
import { createAttestation } from "~/lib/eas/createAttestation";
import { config, eas } from "~/config";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import { useApplications } from "~/features/applications/hooks/useApplications";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { type Application } from "~/features/applications/types";
import { type Attestation } from "~/utils/fetchAttestations";
import { useMemo } from "react";
import { Badge } from "~/components/ui/Badge";
import { ChevronDown } from "lucide-react";
import { useAccount } from "wagmi";

function ApplicationItem({
  id,
  attester,
  name,
  metadataPtr,
  isApproved,
  ...props
}: Attestation & { isApproved?: boolean }) {
  const metadata = useMetadata<Application>(metadataPtr);

  const form = useFormContext();

  const {
    description,
    fundingSources = [],
    impactMetrics = [],
  } = metadata.data ?? {};

  return (
    <Accordion.Root type="single" collapsible>
      <div className="flex items-center gap-2 rounded border-b dark:border-gray-800 hover:dark:bg-gray-800">
        <Accordion.Item className="flex-1" value={id}>
          <Accordion.Header>
            <Accordion.Trigger asChild className="group flex flex-1">
              <label className="flex flex-1 cursor-pointer items-center gap-4 p-2">
                <Checkbox
                  disabled={isApproved}
                  {...form.register(id)}
                  type="checkbox"
                />

                <ProjectAvatar size="sm" profileId={attester} />
                <div className=" flex-1">
                  <div className="flex items-center justify-between">
                    <div>{name}</div>
                  </div>
                  <div>
                    <div className="flex gap-4 text-xs dark:text-gray-400">
                      <div>{fundingSources.length} funding sources</div>
                      <div>{impactMetrics.length} impact metrics</div>
                    </div>
                    <div className="line-clamp-2 text-sm dark:text-gray-300">
                      {description}
                    </div>
                  </div>
                </div>
                <div>
                  {isApproved && <Badge variant="success">Approved</Badge>}
                </div>
                <IconButton
                  className="transition-transform group-data-[state=closed]:rotate-180"
                  icon={ChevronDown}
                  type="button"
                  variant=""
                ></IconButton>
              </label>
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="mb-8 ml-2 max-h-96 overflow-auto pl-24 transition">
            <Markdown>{description}</Markdown>
          </Accordion.Content>
        </Accordion.Item>
      </div>
    </Accordion.Root>
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
          {
            values: { type: "application" },
            schemaUID: eas.schemas.approval,
            refUID,
          },
          signer,
        ),
      ),
    );
    return attest.mutateAsync(
      attestations.map((att) => ({ ...att, data: [att.data] })),
    );
  });
}

function useApprovals() {
  return api.applications.approvals.useQuery({});
}

export function ApplicationsToApprove() {
  const applications = useApplications();
  const approved = useApprovals();
  const approve = useApprove();

  const approvedById = useMemo(
    () =>
      approved.data?.reduce(
        (map, x) => (map.set(x.refUID, true), map),
        new Map<string, boolean>(),
      ),
    [approved.data],
  );

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
Select the applications you want to approve. You must be a configured admin to approve applications.
      `}</Markdown>

      <div className="my-2 flex justify-end">
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
        <ApplicationItem
          key={item.id}
          {...item}
          isApproved={approvedById?.get(item.id)}
        />
      ))}
    </Form>
  );
}

function ApproveButton() {
  const { address } = useAccount();
  const form = useFormContext();
  const selectedCount = Object.values(form.watch()).filter(Boolean).length;

  const isAdmin = config.admins.includes(address!);
  return (
    <Button
      disabled={!selectedCount || !isAdmin}
      variant="primary"
      type="submit"
    >
      {isAdmin
        ? `Approve ${selectedCount} applications`
        : "You must be an admin"}
    </Button>
  );
}
