import type { ReactNode } from "react";
import { ExternalLink } from "~/components/ui/Link";

export function LinkBox<T extends { url: string }>({
  label,
  links,
  renderItem,
}: {
  label?: string;
  links?: T[];
  renderItem: (link: T) => ReactNode;
}) {
  return (
    <div className="rounded-xl border p-3 dark:border-outlineVariant-dark">
      {label && (
        <div className="mb-2 font-bold tracking-wider text-gray-600 dark:text-onSurface-dark">
          {label}
        </div>
      )}
      <div className="space-y-2">
        {links?.map((link, i) => {
          if (link?.url)
            return (
              <ExternalLink
                key={i}
                href={link?.url}
                className="flex gap-2 hover:underline"
              >
                {renderItem(link)}
              </ExternalLink>
            );
        })}
      </div>
    </div>
  );
}
