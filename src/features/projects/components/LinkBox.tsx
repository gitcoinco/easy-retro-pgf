import type { ReactNode } from "react";
import { ExternalLink } from "~/components/ui/Link";

export function LinkBox<T extends { url: string }>({
  label,
  links,
  renderItem,
  shouldValidateWithHttps = true,
}: {
  label?: string;
  links?: T[];
  renderItem: (link: T) => ReactNode;
  shouldValidateWithHttps?: boolean;
}) {
  return (
    <div className="rounded-xl border px-5 py-6 dark:border-outline-dark">
      {label && (
        <div className="mb-5 text-base font-medium tracking-wider text-gray-600 dark:text-onPrimary-light">
          {label}
        </div>
      )}
      <div className="space-y-2">
        {links?.map((link, i) => {
          if (link?.url)
            return (
              <ExternalLink
                key={i}
                href={
                  shouldValidateWithHttps && !link?.url.startsWith("https://")
                    ? `https://${link?.url}`
                    : link.url
                }
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
