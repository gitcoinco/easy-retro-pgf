import { useMemo } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { NameENS } from "~/components/ENS";
import { EmptyState } from "~/components/EmptyState";
import { Button } from "~/components/ui/Button";
import { Skeleton } from "~/components/ui/Skeleton";
import { useRevokeApplication } from "~/features/applications/hooks/useApproveApplication";
import { api } from "~/utils/api";

function useVoters() {
  return api.voters.list.useQuery({});
}

export function VotersList() {
  const { address } = useAccount();
  const { data, isPending } = useVoters();
  const revoke = useRevokeApplication({});

  if (!isPending && !data?.length)
    return (
      <EmptyState title="No voters">
        Add voters to allow them to vote
      </EmptyState>
    );

  return (
    <div className="mx-auto max-w-screen-sm space-y-2">
      {(
        data ??
        Array(5)
          .fill(0)
          .map((_, i) => ({ recipient: String(i) }))
      )?.map((voter, i) => {
        return (
          <div
            key={voter.recipient + i}
            className="flex items-center gap-2 border-b pb-2 dark:border-gray-800"
          >
            <Skeleton isLoading={isPending} className="min-h-4 w-96">
              <NameENS className="flex-1" address={voter.recipient} />
            </Skeleton>
            <Button
              size="sm"
              variant="outline"
              disabled={voter?.attester !== address}
              isLoading={
                revoke.isPending && revoke.variables.includes(voter.id)
              }
              onClick={() => {
                revoke.mutate([voter.id]);
              }}
            >
              Revoke
            </Button>
          </div>
        );
      })}
    </div>
  );
}
