import { Check } from "lucide-react";
import { useAccount } from "wagmi";
import { NameENS } from "~/components/ENS";
import { EmptyState } from "~/components/EmptyState";
import { Button } from "~/components/ui/Button";
import { Skeleton } from "~/components/ui/Skeleton";
import { useRevokeAttestations } from "~/hooks/useRevokeAttestations";
import { api } from "~/utils/api";

function useVoters() {
  return api.voters.list.useQuery({});
}

export function VotersList() {
  const { address } = useAccount();
  const { data, isPending } = useVoters();
  const revoke = useRevokeAttestations({});

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
          .map((_, i) => ({
            id: String(i),
            recipient: String(i),
            attester: String(i),
            hasVoted: false,
          }))
      )?.map((voter, i) => {
        return (
          <div
            key={voter.recipient + i}
            className="flex items-center gap-2 border-b pb-2 dark:border-gray-800"
          >
            <div className="flex flex-1 items-center justify-between">
              <Skeleton isLoading={isPending} className="min-h-4 w-96">
                <NameENS className="flex-1" address={voter.recipient} />
              </Skeleton>
              <div>
                {voter.hasVoted ? (
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">voted</span>
                    <Check className="size-3 text-green-600" />
                  </span>
                ) : null}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={voter.attester !== address}
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
