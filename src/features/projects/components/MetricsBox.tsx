// MetricsBox.tsx
import type { ReactNode } from "react";

interface MetricItem {
  label: string;
  value: ReactNode;
}

export function MetricsBox({
  label,
  data,
}: {
  label: string;
  data?: MetricItem[];
}) {
  return (
    <div className="rounded-xl border p-3 dark:border-gray-700">
      <div className="mb-2 font-bold tracking-wider text-gray-600 dark:text-gray-500">
        {label}
      </div>
      <div className="space-y-2">
        {data?.map((item, i) => (
          <div key={i} className="flex justify-between">
            <div className="flex-1 truncate" title={item.label}>
              {item.label}
            </div>
            <div className="font-medium">
              {typeof item.value === "number"
                ? item.value.toLocaleString()
                : item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
