import Link from "next/link";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { Badge } from "~/components/ui/Badge";
import { Skeleton } from "~/components/ui/Skeleton";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { api } from "~/utils/api";
import { type Attestation } from "~/utils/fetchAttestations";
import { formatDate } from "~/utils/time";

export function MyApplications() {
  const { address } = useAccount();
  const applications = api.applications.list.useQuery(
    { attester: address },
    { enabled: Boolean(address) },
  );

  const ids = applications.data?.map((a) => a.id);
  const approvals = api.applications.approvals.useQuery(
    { ids },
    { enabled: Boolean(ids?.length) },
  );
  const approvalsById = useMemo(
    () =>
      Object.fromEntries(
        (approvals.data ?? [])
          .filter((a) => !a.revoked)
          .map((a) => [a.refUID, true]),
      ),
    [approvals],
  );

  return (
    <div>
      <h1 className="text-xl font-semibold">My Applications</h1>

      <div>
        {applications.data?.map((application) => {
          const isApproved = approvalsById[application.id];

          return (
            <div key={application.id}>
              <ApplicationItem {...application} isApproved={isApproved} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApplicationItem({
  id,
  recipient,
  name,
  time,
  isLoading,
  isApproved,
}: Attestation & {
  isLoading?: boolean;
  isApproved?: boolean;
}) {
  const roundId = useCurrentDomain();
  return (
    <div className="flex items-center gap-2 rounded border-b hover:bg-gray-100 dark:border-gray-800 hover:dark:bg-gray-800">
      <Link
        href={`/${roundId}/applications/${id}`}
        className="flex flex-1 cursor-pointer items-center gap-4 p-2"
      >
        <ProjectAvatar isLoading={isLoading} size="sm" profileId={recipient} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Skeleton isLoading={isLoading} className="mb-1 min-h-5 min-w-24">
              {name}
            </Skeleton>
          </div>
        </div>
        <div>{formatDate(time * 1000)}</div>
        {isApproved ? (
          <Badge variant="success">Approved</Badge>
        ) : (
          <Badge>Pending</Badge>
        )}
      </Link>
    </div>
  );
}
