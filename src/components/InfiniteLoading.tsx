import { useMemo, type ReactNode, useRef, useEffect } from "react";
import { type UseTRPCInfiniteQueryResult } from "@trpc/react-query/shared";
import Link from "next/link";
import Image from "next/image";
import { config } from "~/config";
import { useIntersection } from "react-use";
import { Spinner } from "./ui/Spinner";
import { EmptyState } from "./EmptyState";
import { Chip } from "./ui/Chip";

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

  const refUIDs: string[] = items
    .filter(
      (item) =>
        item.refUID !==
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    )
    .map((item) => item.refUID);

  const filteredData = items?.filter((item) => !refUIDs?.includes(item.id));

  return (
    <div>
      {!isLoading && !items?.length ? (
        <EmptyState title="No results found" />
      ) : null}
      <div
        className={`mb-16 flex flex-col sm:grid ${columnMap[columns]} gap-2 sm:gap-4 lg:gap-5`}
      >
        <article className="hover:border-primary-500 group border border-gray-200 pb-2 dark:border-onPrimary-light dark:hover:border-outline-dark">
          <Link href="/applications/new">
            <Image
              alt="create new app"
              src="/pokt.png"
              width={234}
              height={234}
              className="m-auto"
            />
          </Link>
          <div className="flex flex-col items-center justify-between gap-3">
            <Chip
              className="gap-2 bg-onPrimary-light px-4 font-semibold text-background-dark hover:bg-primary-dark dark:hover:text-background-dark md:px-10"
              as={Link}
              href={"/applications/new"}
            >
              Apply Now
            </Chip>
            <Link
              href="https://docs.pokt.network/community/retro-pokt-goods-funding/application-process"
              target="_blank"
              className=" text-sm text-primary-dark hover:text-onPrimary-light"
            >
              Eligibility and Criteria
            </Link>
          </div>
        </article>

        {filteredData?.map((item) => renderItem(item, { isLoading }))}
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
