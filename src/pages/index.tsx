import { BaseLayout } from "~/layouts/BaseLayout";
import { Button } from "~/components/ui/Button";
import Link from "next/link";
import { api } from "~/utils/api";
import { InfiniteLoading } from "~/components/InfiniteLoading";
import { Heading } from "~/components/ui/Heading";
import { Skeleton } from "~/components/ui/Skeleton";
import { Banner } from "~/components/ui/Banner";

export default function ProjectsPage({}) {
  const rounds = api.rounds.list.useInfiniteQuery(
    {},
    { getNextPageParam: (_, pages) => pages.length },
  );
  return (
    <BaseLayout>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Active Rounds</h1>
        <Button variant="primary" as={Link} href={`/create-round`}>
          Create new round
        </Button>
      </div>

      <InfiniteLoading
        columns={3}
        {...rounds}
        renderItem={(item, { isLoading }) => (
          <Link
            key={item.id}
            href={`/${item.domain}`}
            className="group rounded-2xl border border-gray-200 p-2 hover:border-primary-500 dark:border-gray-700 dark:hover:border-primary-500"
          >
            <Banner />
            {/* <div className="h-24 bg-gray-800" /> */}
            <Heading className="truncate" size="lg" as="h3">
              <Skeleton isLoading={isLoading}>{item?.name}</Skeleton>
            </Heading>
            <div className="mb-2">
              <p className="line-clamp-2 h-10 text-sm dark:text-gray-300">
                <Skeleton isLoading={isLoading} className="w-full">
                  {item?.description}
                </Skeleton>
              </p>
            </div>
          </Link>
        )}
      />
    </BaseLayout>
  );
}
