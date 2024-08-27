import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Checkbox } from "~/components/ui/Form";
import { NameENS } from "~/components/ENS";
import { cn } from "~/utils/classNames";

export function VotersList({
  voters = [],
  disabled = [],
}: {
  voters?: { address: `0x${string}`; hasVoted: boolean | undefined }[];
  disabled?: string[];
}) {
  const form = useFormContext<{ selected: string[] }>();
  return (
    <div>
      {!voters.length && (
        <div className="flex items-center justify-center p-6">
          No addresses added yet.
        </div>
      )}
      {voters.map((voter) => {
        const isDisabled = disabled.includes(voter.address);
        return (
          <div
            key={voter.address}
            className={cn(
              "flex items-center gap-2 rounded border-b dark:border-gray-800 hover:dark:bg-gray-800",
              {
                ["opacity-60"]: isDisabled,
              },
            )}
          >
            <label className="flex flex-1 cursor-pointer items-center gap-4 p-3 font-mono">
              <Checkbox
                disabled={isDisabled}
                value={voter.address}
                {...form.register(`selected`)}
              />
              <NameENS address={voter.address} truncateLength={100} />
              {voter.hasVoted ? (
                <span className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">voted</span>
                  <Check className="size-3 text-green-600" />
                </span>
              ) : null}
            </label>
          </div>
        );
      })}
    </div>
  );
}
