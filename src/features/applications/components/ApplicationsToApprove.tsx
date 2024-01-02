import { z } from "zod";
import { useMemo } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/Button";
import { Checkbox, Form } from "~/components/ui/Form";
import { Markdown } from "~/components/ui/Markdown";
import { Spinner } from "~/components/ui/Spinner";
import { useMetadata } from "~/hooks/useMetadata";
import { api } from "~/utils/api";
import { useApplications } from "~/features/applications/hooks/useApplications";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { type Application } from "~/features/applications/types";
import { type Attestation } from "~/utils/fetchAttestations";
import { Badge } from "~/components/ui/Badge";
import { useApproveApplication } from "../hooks/useApproveApplication";
import { useIsAdmin } from "~/hooks/useIsAdmin";

function ApplicationItem({
  id,
  attester,
  name,
  metadataPtr,
  isApproved,
}: Attestation & { isApproved?: boolean }) {
  const metadata = useMetadata<Application>(metadataPtr);

  const form = useFormContext();

  const {
    description,
    fundingSources = [],
    impactMetrics = [],
  } = metadata.data ?? {};

  return (
    <div className="flex items-center gap-2 rounded border-b dark:border-gray-800 hover:dark:bg-gray-800">
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
        {isApproved ? (
          <Badge variant="success">Approved</Badge>
        ) : (
          <Badge>Pending</Badge>
        )}
        <Button
          as={Link}
          target="_blank"
          href={`/applications/${id}`}
          className="transition-transform group-data-[state=closed]:rotate-180"
          type="button"
          variant=""
        >
          Review
        </Button>
      </label>
    </div>
  );
}

function useApprovals() {
  return api.applications.approvals.useQuery({});
}

export function ApplicationsToApprove() {
  const applications = useApplications();
  const approved = useApprovals();
  const approve = useApproveApplication();

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
  const isAdmin = useIsAdmin();
  const form = useFormContext();
  const selectedCount = Object.values(form.watch()).filter(Boolean).length;

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
