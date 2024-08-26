import { useMemo, type ReactNode } from "react";
import { config } from "~/config";
import { EmptyState } from "./EmptyState";
import { Attestation } from "@ethereum-attestation-service/eas-sdk";

const columnMap = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
} as const;

type Props<T> = {
  data: Attestation[] ;
  isLoading: boolean;
  renderItem: (item: T, opts: { isLoading: boolean }) => ReactNode;
  columns?: keyof typeof columnMap;
};

export function ProjectsLoading<T>({
  data,
  columns = 3,
  isLoading,
  renderItem,
}: Props<T>) {
  const loadingItems = useMemo(
    () =>
      Array.from({ length: config.pageSize }).map((_, id) => ({
        id,
      })) as T[],
    [],
  );
  const items = (data ?? []) as T[];

  return (
    <div>
      {!isLoading && !items?.length ? (
        <EmptyState title="No results found" />
      ) : null}
      <div
        className={`mb-16 flex flex-col sm:grid ${columnMap[columns]} gap-2 sm:gap-4`}
      >
        {items.map((item) => renderItem(item, { isLoading }))}
        {isLoading &&
          loadingItems.map((item) => renderItem(item, { isLoading }))}
      </div>
    </div>
  );
}
