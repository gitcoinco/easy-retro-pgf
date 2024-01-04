import { z } from "zod";
import { useMemo } from "react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/Button";
import { Checkbox, Form } from "~/components/ui/Form";
import { Markdown } from "~/components/ui/Markdown";
import { useMetadata } from "~/hooks/useMetadata";
import { api } from "~/utils/api";
import { useApplications } from "~/features/applications/hooks/useApplications";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { type Application } from "~/features/applications/types";
import { type Attestation } from "~/utils/fetchAttestations";
import { Badge } from "~/components/ui/Badge";
import { useApproveApplication } from "../hooks/useApproveApplication";
import { useIsAdmin } from "~/hooks/useIsAdmin";
import { Skeleton } from "~/components/ui/Skeleton";
import { Spinner } from "~/components/ui/Spinner";

export function ApplicationItem({
  id,
  recipient,
  name,
  metadataPtr,
  isApproved,
  isLoading,
}: Attestation & { isApproved?: boolean; isLoading?: boolean }) {
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
          {...form.register(`selected.${id}`)}
          type="checkbox"
        />

        <ProjectAvatar isLoading={isLoading} size="sm" profileId={recipient} />
        <div className=" flex-1">
          <div className="flex items-center justify-between">
            <Skeleton isLoading={isLoading} className="mb-1 min-h-5 min-w-24">
              {name}
            </Skeleton>
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
          disabled={isLoading}
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

const ApplicationsToApproveSchema = z.object({
  selected: z.record(z.boolean()),
});

type ApplicationsToApprove = z.infer<typeof ApplicationsToApproveSchema>;
function useApprovals() {
  return api.applications.approvals.useQuery({});
}

export function ApplicationsToApprove() {
  const applications = useApplications();
  const approved = useApprovals();
  const approve = useApproveApplication({});

  const approvedById = useMemo(
    () =>
      approved.data?.reduce(
        (map, x) => (map.set(x.refUID, true), map),
        new Map<string, boolean>(),
      ),
    [approved.data],
  );

  const applicationsToApprove = applications.data?.filter(
    (application) => !approvedById?.get(application.id),
  );

  return (
    <Form
      schema={ApplicationsToApproveSchema}
      onSubmit={(values) => {
        console.log("approve", values);
        const selected = Object.keys(values.selected).filter(
          (key) => values.selected[key],
        );
        console.log("selected", selected);

        approve.mutate(selected);
      }}
    >
      <Markdown>{`### Review applications
Select the applications you want to approve. You must be a configured admin to approve applications.
      `}</Markdown>

      <div className="my-2 flex items-center justify-between">
        <div className="text-gray-300">
          {applications.data?.length} applications found
        </div>
        <div className="flex gap-2">
          <SelectAllButton applications={applicationsToApprove} />
          <ApproveButton isLoading={approve.isLoading} />
        </div>
      </div>

      {applications.isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : !applications.data?.length ? (
        <div>No applications found</div>
      ) : null}
      {applications.data?.map((item) => (
        <ApplicationItem
          key={item.id}
          {...item}
          isLoading={applications.isLoading}
          isApproved={approvedById?.get(item.id)}
        />
      ))}
    </Form>
  );
}

function SelectAllButton({
  applications = [],
}: {
  applications: Attestation[] | undefined;
}) {
  const form = useFormContext<ApplicationsToApprove>();
  console.log("form", form.watch());
  const selected = form.watch("selected");

  const isAllSelected = selected && Object.values(selected).every(Boolean);
  return (
    <Button
      disabled={!applications.length}
      type="button"
      onClick={() => {
        const allApplications = applications.reduce(
          (applications, curr) => ({
            ...applications,
            [curr.id]: !isAllSelected,
          }),
          {},
        );
        console.log({ allApplications });
        form.setValue("selected", allApplications);
      }}
    >
      {isAllSelected ? "Deselect all" : "Select all"}
    </Button>
  );
}

function ApproveButton({ isLoading = false }) {
  const isAdmin = useIsAdmin();
  const form = useFormContext<ApplicationsToApprove>();
  const selectedCount = Object.values(form.watch("selected") ?? {}).filter(
    Boolean,
  ).length;

  return (
    <Button
      suppressHydrationWarning
      disabled={!selectedCount || !isAdmin || isLoading}
      variant="primary"
      type="submit"
    >
      {isAdmin
        ? `Approve ${selectedCount} applications`
        : "You must be an admin"}
    </Button>
  );
}
