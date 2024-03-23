import { format, isValid } from "date-fns";
import { Clock, Globe } from "lucide-react";
import Link from "next/link";
import { tv } from "tailwind-variants";
import { createComponent } from "~/components/ui";
import { Heading } from "~/components/ui/Heading";
import { networkNames } from "~/config";
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
            <div className="rounded p-4 hover:bg-gray-100">
              <h3 className="text-lg font-semibold">{round.name}</h3>
              <Meta>
                <MetaIcon as={Clock} />
                <div>
                  {formatDate(round.startsAt)} -{" "}
                  {formatDate(round.distributionAt)}
                </div>
              </Meta>
              <Meta>
                <MetaIcon as={Globe} />
                <div>
                  {round.network ? networkNames[round.network] : "not set"}
                </div>
              </Meta>
            </div>
          </Link>
        ))}
      </div>
    </BaseLayout>
  );
}

const Meta = createComponent(
  "div",
  tv({
    base: "flex items-center gap-2 text-sm",
  }),
);
const MetaIcon = createComponent(
  "div",
  tv({
    base: "size-3",
  }),
);

function formatDate(date: Date | null) {
  return isValid(date) ? format(date!, "dd MMM yyyy") : "";
}
