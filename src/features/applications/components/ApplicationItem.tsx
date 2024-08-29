"use client";

import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { type Address } from "viem";
import { useAccount } from "wagmi";
import { ClockIcon, EyeIcon } from "lucide-react";

import { Button } from "~/components/ui/Button";
import { Checkbox } from "~/components/ui/Form";
import { useMetadata } from "~/hooks/useMetadata";
import { ProfileAvatar } from "~/features/projects/components/ProfileAvatar";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { type Application } from "~/features/applications/types";
import { type Attestation } from "~/utils/fetchAttestations";
import { Badge } from "~/components/ui/Badge";
import { Skeleton } from "~/components/ui/Skeleton";
import { formatDate } from "~/utils/time";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { useRevokeAttestations } from "~/hooks/useRevokeAttestations";

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
  const { address } = useAccount();
  const metadata = useMetadata<Application>(metadataPtr);
  const domain = useCurrentDomain();
  const form = useFormContext();
  const revoke = useRevokeAttestations({});

  const {
    fundingSources = [],
    impactMetrics = [],
    sunnyAwards,
  } = metadata.data ?? {};
  const isApproved = Boolean(approvedBy);

  return (
    <div className="flex items-center gap-2 rounded border-b hover:bg-gray-100 dark:border-gray-800 hover:dark:bg-gray-800">
      <label className="flex flex-1 items-center gap-4 p-2">
        <Checkbox
          disabled={isApproved}
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
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-400">
          <ClockIcon className="size-3" />
          <Skeleton isLoading={isLoading} className="mb-1 min-h-5 min-w-24">
            {formatDate(time * 1000)}
          </Skeleton>
        </div>
        <div className="flex w-20">
          {isApproved ? (
            <Badge variant="success">Approved</Badge>
          ) : (
            <Badge>Pending</Badge>
          )}
        </div>
        {isApproved ? (
          <>
            <Button
              size="sm"
              variant="outline"
              disabled={approvedBy?.attester !== address}
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
            <Button
              disabled={isLoading}
              as={Link}
              target="_blank"
              href={`/${domain}/applications/${id}`}
              className="transition-transform group-data-[state=closed]:rotate-180"
              type="button"
              variant="link"
              icon={EyeIcon}
            />
          </>
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
