import { LuCopy } from "react-icons/lu"; // Importing from simple-icons
import { copyToClipboard } from "~/utils/copyToClipboard";

export function AddressBox({
  label,
  addresses,
}: {
  label: string;
  addresses?: string[];
}) {
  return (
    <div className="rounded-xl border p-3 dark:border-gray-700">
      <div className="mb-2 font-bold tracking-wider text-gray-600">{label}</div>
      <div className="space-y-2">
        {addresses?.map((address) => (
          <div
            key={address}
            className="flex items-center justify-between  gap-2"
          >
            <div className="truncate" title={address}>
              {address}
            </div>
            <LuCopy
              className="h-4 w-4 shrink-0 cursor-pointer"
              onClick={() => copyToClipboard({ text: address })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
