"use client";

import { useFormContext } from "react-hook-form";
import { ClockIcon } from "lucide-react";

import { Checkbox } from "~/components/ui/Form";
import { useMetadata } from "~/hooks/useMetadata";
import { ProfileAvatar } from "~/features/projects/components/ProfileAvatar";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { type Application } from "~/features/applications/types";
import { type Attestation } from "~/utils/fetchAttestations";
import { Badge } from "~/components/ui/Badge";
import { Skeleton } from "~/components/ui/Skeleton";
import { formatDate } from "~/utils/time";
import { ApplicationReviewActions } from "./ApplicationReviewActions";
import { api } from "~/utils/api";

export function ApplicationItem({
  id,
  recipient,
  name,
  metadataPtr,
  time = 0,
  isLoading = false,
}: Partial<Attestation> & {
  isLoading?: boolean;
}) {
  const metadata = useMetadata<Application>(metadataPtr);
  const form = useFormContext();

  const {
    fundingSources = [],
    impactMetrics = [],
    sunnyAwards,
  } = metadata.data ?? {};

  const { data } = api.applications.status.useQuery(
    { projectId: id ?? "" },
    { enabled: !!id },
  );

  const checkboxDisabled = isLoading || data?.status === "approved";

  return (
    <div className="flex items-center gap-2 rounded border-b hover:bg-gray-100 dark:border-gray-800 hover:dark:bg-gray-800">
      <label className="flex flex-1 items-center gap-4 p-2">
        <Checkbox
          disabled={checkboxDisabled}
          value={id}
          {...form.register(`selected`)}
          type="checkbox"
        />

        {sunnyAwards ? (
          <ProjectAvatar
            isLoading={isLoading}
            size="sm"
            avatarUrl={sunnyAwards?.avatarUrl}
          />
        ) : (
          <ProfileAvatar
            isLoading={isLoading}
            size="sm"
            profileId={recipient}
          />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Skeleton isLoading={isLoading} className="mb-1 min-h-5 min-w-24">
              {name}
            </Skeleton>
          </div>
          <Skeleton
            isLoading={isLoading || metadata.isPending}
            className="mb-1 h-3 min-w-48"
          >
            {sunnyAwards ? (
              <div className="flex gap-4 text-xs dark:text-gray-400">
                {sunnyAwards.projectType && (
                  <Badge size="xs" variant="info">
                    {sunnyAwards.projectType}
                  </Badge>
                )}
                {sunnyAwards.category && (
                  <Badge size="xs" variant="success">
                    {sunnyAwards.category}
                  </Badge>
                )}
              </div>
            ) : (
              <div className="flex gap-4 text-xs dark:text-gray-400">
                <div>{fundingSources.length} funding sources</div>
                <div>{impactMetrics.length} impact metrics</div>
              </div>
            )}
          </Skeleton>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-400">
          <ClockIcon className="size-3" />
          <Skeleton isLoading={isLoading} className="mb-1 min-h-5 min-w-24">
            {formatDate(time * 1000)}
          </Skeleton>
        </div>
        <ApplicationReviewActions
          variant="listItem"
          projectId={id}
          isLoading={isLoading}
        />
      </label>
    </div>
  );
}
