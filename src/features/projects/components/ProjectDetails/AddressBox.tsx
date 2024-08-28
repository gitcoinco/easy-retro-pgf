export function AddressBox({
  label,
  addresses,
}: {
  label: string;
  addresses?: string[];
}) {
  return (
    <div className="rounded-xl border p-3 dark:border-gray-700">
      <div className="mb-2 font-bold tracking-wider text-gray-600 dark:text-gray-500">
        {label}
      </div>
      <div className="space-y-2">
        {addresses?.map((address) => (
          <div className="truncate" title={address}>
            {address}
          </div>
        ))}
      </div>
    </div>
  );
}
