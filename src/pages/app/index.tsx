import Link from "next/link";
import { Heading } from "~/components/ui/Heading";
import { BaseLayout } from "~/layouts/BaseLayout";
import { api } from "~/utils/api";

export default function AppPage() {
  const rounds = api.rounds.list.useQuery();
  return (
    <BaseLayout>
      <Heading as="h1" size="2xl">
        My rounds
      </Heading>
      <div className="flex max-w-sm flex-col gap-2">
        {rounds.data?.map((round) => (
          <Link key={round.id} href={`/${round.domain}/admin`}>
            <div className="rounded-full p-4 hover:bg-gray-100">
              <Heading>{round.name}</Heading>
            </div>
          </Link>
        ))}
      </div>
    </BaseLayout>
  );
}
