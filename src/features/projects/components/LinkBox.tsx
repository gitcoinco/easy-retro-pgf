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
    <div className="rounded-xl border py-6 px-5 dark:border-outline-dark">
      {label && (
        <div className="mb-5 font-medium text-base tracking-wider text-gray-600 dark:text-onPrimary-light">
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
                className="flex items-center gap-2 text-sm font-medium hover:text-primary-dark"
              >
                {renderItem(link)}
              </ExternalLink>
            );
        })}
      </div>
    </div>
  );
}
