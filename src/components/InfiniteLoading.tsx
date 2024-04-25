import { useMemo, type ReactNode, useRef, useEffect } from "react";
import { type UseTRPCInfiniteQueryResult } from "@trpc/react-query/shared";

import { config } from "~/config";
import { useIntersection } from "react-use";
import { Spinner } from "./ui/Spinner";
import { EmptyState } from "./EmptyState";

const columnMap = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
} as const;

type Props<T> = UseTRPCInfiniteQueryResult<T[], unknown> & {
  renderItem: (item: T, opts: { isLoading: boolean }) => ReactNode;
  columns?: keyof typeof columnMap;
};

export function InfiniteLoading<T>({
  data,
  columns = 3,
  isFetchingNextPage,
  isLoading,
  renderItem,
  fetchNextPage,
}: Props<T>) {
  const loadingItems = useMemo(
    () =>
      Array.from({ length: config.pageSize }).map((_, id) => ({
        id,
      })) as T[],
    [],
  );
  const pages = data?.pages ?? [];
  const items = useMemo(
    () => pages.reduce<T[]>((acc, x) => acc.concat(x), []) ?? [],
    [pages],
  );

  const hasMore = useMemo(() => {
    if (!pages.length) return false;
    return (pages[pages.length - 1]?.length ?? 0) === config.pageSize;
  }, [pages]);

  return (
    <div>
      {!isLoading && !items?.length ? (
        <EmptyState title="No results found" />
      ) : null}
      <div
        className={`mb-16 flex flex-col sm:grid ${columnMap[columns]} gap-2 sm:gap-4 lg:gap-5`}
      >
        {items.map((item) => renderItem(item, { isLoading }))}
        {(isLoading || isFetchingNextPage) &&
          loadingItems.map((item) => renderItem(item, { isLoading }))}
      </div>

      <FetchInView
        hasMore={hasMore}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}

function FetchInView({
  hasMore,
  isFetchingNextPage,
  fetchNextPage,
}: {
  hasMore?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
}) {
  const ref = useRef(null);
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });

  useEffect(() => {
    if (intersection?.isIntersecting) {
      !isFetchingNextPage && hasMore && fetchNextPage().catch(console.log);
    }
  }, [intersection?.isIntersecting]);

  return (
    <div className="flex h-96 items-center justify-center" ref={ref}>
      {isFetchingNextPage && <Spinner />}
    </div>
  );
}
