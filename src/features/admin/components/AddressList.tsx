import { useFormContext } from "react-hook-form";

import { Checkbox } from "~/components/ui/Form";
import { NameENS } from "~/components/ENS";
import { cn } from "~/utils/classNames";

export function AddressList({
  addresses = [],
  disabled = [],
}: {
  addresses?: string[];
  disabled?: string[];
}) {
  const form = useFormContext<{ selected: string[] }>();
  return (
    <div>
      {!addresses.length && (
        <div className="flex items-center justify-center p-6">
          No addresses added yet.
        </div>
      )}
      {addresses.map((addr) => {
        const isDisabled = disabled.includes(addr);
        return (
          <div
            key={addr}
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
                value={addr}
                {...form.register(`selected`)}
              />
              <NameENS address={addr} truncateLength={100} />
            </label>
          </div>
        );
      })}
    </div>
  );
}
