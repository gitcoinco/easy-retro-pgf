import { useMemo, type ReactNode, useRef, useEffect } from "react";
import { type UseTRPCInfiniteQueryResult } from "@trpc/react-query/shared";

import { config } from "~/config";
import { useIntersection } from "react-use";
import { Spinner } from "./ui/Spinner";

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
  const items = useMemo(
    () => data?.pages.reduce<T[]>((acc, x) => acc.concat(x), []) ?? [],
    [data],
  );

  return (
    <div>
      <div className={`mb-16 grid ${columnMap[columns]} gap-4`}>
        {items.map((item) => renderItem(item, { isLoading }))}
        {(isLoading || isFetchingNextPage) &&
          loadingItems.map((item) => renderItem(item, { isLoading }))}
      </div>

      <FetchInView
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}

function FetchInView({
  isFetchingNextPage,
  fetchNextPage,
}: {
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
      console.log("load more");
      fetchNextPage().catch(console.log);
    }
  }, [intersection?.isIntersecting]);

  return (
    <div className="flex h-96 items-center justify-center" ref={ref}>
      {isFetchingNextPage && <Spinner />}
    </div>
  );
}
