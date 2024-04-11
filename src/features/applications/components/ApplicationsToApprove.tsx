import { z } from "zod";
import { useMemo } from "react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { type Address } from "viem";

import { Button } from "~/components/ui/Button";
import { Checkbox, Form, FormSection } from "~/components/ui/Form";
import { useMetadata } from "~/hooks/useMetadata";
import { useApplications } from "~/features/applications/hooks/useApplications";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { type Application } from "~/features/applications/types";
import { type Attestation } from "~/utils/fetchAttestations";
import { Badge } from "~/components/ui/Badge";
import {
  useApproveApplication,
  useRevokeApplication,
} from "../hooks/useApproveApplication";
import { useIsAdmin } from "~/hooks/useIsAdmin";
import { Skeleton } from "~/components/ui/Skeleton";
import { Spinner } from "~/components/ui/Spinner";
import { EmptyState } from "~/components/EmptyState";
import { formatDate } from "~/utils/time";
import { ClockIcon } from "lucide-react";
import { useApprovedApplications } from "../hooks/useApprovedApplications";
import { Alert } from "~/components/ui/Alert";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { EnsureCorrectNetwork } from "~/components/EnureCorrectNetwork";

export function ApplicationItem({
  id,
  recipient,
  name,
  metadataPtr,
  time,
  approvedBy,
  isLoading,
}: Attestation & {
  approvedBy?: { attester: Address; uid: string };
  isLoading?: boolean;
}) {
  const metadata = useMetadata<Application>(metadataPtr);
  const domain = useCurrentDomain();
  const form = useFormContext();
  const revoke = useRevokeApplication({});

  const { bio, fundingSources = [], impactMetrics = [] } = metadata.data ?? {};
  const isApproved = Boolean(approvedBy);

  return (
    <div className="flex items-center gap-2 rounded border-b dark:border-gray-800 hover:dark:bg-gray-800">
      <label className="flex flex-1 cursor-pointer items-center gap-4 p-2">
        <Checkbox
          disabled={isApproved}
          value={id}
          {...form.register(`selected`)}
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
            <div className="line-clamp-2 text-sm dark:text-gray-300">{bio}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-400">
          <ClockIcon className="size-3" />
          <Skeleton isLoading={isLoading} className="mb-1 min-h-5 min-w-24">
            {formatDate(time * 1000)}
          </Skeleton>
        </div>
        {isApproved ? (
          <Badge variant="success">Approved</Badge>
        ) : (
          <Badge>Pending</Badge>
        )}
        {isApproved ? (
          <Button
            variant="outline"
            isLoading={revoke.isPending}
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure? This will revoke the application and must be done by the same person who approved it.",
                )
              )
                revoke.mutate([approvedBy?.uid]);
            }}
          >
            Revoke
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            as={Link}
            target="_blank"
            href={`/${domain}/applications/${id}`}
            className="transition-transform group-data-[state=closed]:rotate-180"
            type="button"
            variant=""
          >
            Review
          </Button>
        )}
      </label>
    </div>
  );
}

const ApplicationsToApproveSchema = z.object({
  selected: z.array(z.string()),
});

type ApplicationsToApprove = z.infer<typeof ApplicationsToApproveSchema>;

export function ApplicationsToApprove() {
  const applications = useApplications();
  const domain = useCurrentDomain();
  const approved = useApprovedApplications();
  const approve = useApproveApplication({});
  const approvedById = useMemo(
    () =>
      approved.data?.reduce(
        (map, x) => (
          map.set(x.refUID, { attester: x.attester, uid: x.id }), map
        ),
        new Map<string, { attester: Address; uid: string }>(),
      ),
    [approved.data],
  );

  const applicationsToApprove = applications.data?.filter(
    (application) => !approvedById?.get(application.id),
  );

  return (
    <Form
      defaultValues={{ selected: [] }}
      schema={ApplicationsToApproveSchema}
      onSubmit={(values) => approve.mutate(values.selected)}
    >
      <FormSection
        title="Review applications"
        description="Select the applications you want to approve. You must be a configured admin to approve applications."
      >
        <Alert variant="info">
          Newly submitted applications can take 10 minutes to show up.
        </Alert>
        <div className="my-2 flex items-center justify-between">
          <div className="text-gray-300">
            {applications.data?.length
              ? `${applications.data?.length} applications found`
              : ""}
          </div>
          <div className="flex gap-2">
            <SelectAllButton applications={applicationsToApprove} />
            <ApproveButton isLoading={approve.isPending} />
          </div>
        </div>
        <div className="flex gap-2">
          <SelectAllButton applications={applicationsToApprove} />
          <ApproveButton isLoading={approve.isPending} />
        </div>

        {applications.isPending ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : !applications.data?.length ? (
          <EmptyState title="No applications">
            <Button
              variant="primary"
              as={Link}
              href={`/${domain}/applications/new`}
            >
              Go to create application
            </Button>
          </EmptyState>
        ) : null}
        {applications.data?.map((item) => (
          <ApplicationItem
            key={item.id}
            {...item}
            isLoading={applications.isPending}
            approvedBy={approvedById?.get(item.id)}
          />
        ))}
      </FormSection>
    </Form>
  );
}

function SelectAllButton({
  applications = [],
}: {
  applications: Attestation[] | undefined;
}) {
  const form = useFormContext<ApplicationsToApprove>();
  const selected = form.watch("selected");
  const isAllSelected =
    selected?.length > 0 && selected?.length === applications?.length;
  return (
    <Button
      disabled={!applications.length}
      type="button"
      onClick={() => {
        const selectAll = isAllSelected ? [] : applications.map(({ id }) => id);
        form.setValue("selected", selectAll);
      }}
    >
      {isAllSelected ? "Deselect all" : "Select all"}
    </Button>
  );
}

function ApproveButton({ isLoading = false }) {
  const form = useFormContext<ApplicationsToApprove>();
  const selectedCount = Object.values(form.watch("selected") ?? {}).filter(
    Boolean,
  ).length;
  return (
    <EnsureCorrectNetwork>
      <Button
        suppressHydrationWarning
        disabled={!selectedCount || isLoading}
        variant="primary"
        type="submit"
      >
        Approve {selectedCount} applications
      </Button>
    </EnsureCorrectNetwork>
  );
}
