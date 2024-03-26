import { format, isValid } from "date-fns";
import { ArrowRight, Clock, Globe, type LucideIcon, Plus } from "lucide-react";
import Link from "next/link";
import { tv } from "tailwind-variants";
import { createComponent } from "~/components/ui";
import { Button } from "~/components/ui/Button";
import { Heading } from "~/components/ui/Heading";
import { networkNames } from "~/config";
import { BaseLayout } from "~/layouts/BaseLayout";
import { api } from "~/utils/api";

export default function AppPage() {
  const rounds = api.rounds.list.useQuery();
  return (
    <BaseLayout>
      <div className="flex items-center justify-between">
        <Heading as="h1" size="2xl">
          My rounds
        </Heading>
        <Button icon={Plus} as={Link} href={"/create-round"}>
          New round
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {rounds.data?.map((round) => (
          <Link key={round.id} href={`/${round.domain}/admin`}>
            <div className="rounded border p-4 hover:bg-gray-100 ">
              <h3 className="text-lg font-semibold">{round.name}</h3>
              <Meta>
                <MetaIcon as={Clock} />
                <div>
                  {formatDate(round.startsAt)} - {formatDate(round.payoutAt)}
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
    base: "flex items-center gap-2 text-sm text-gray-600",
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

function RoundTimeline({ round }: { round: RoundSchema }) {
  const phases: { label: string; key: string; icon: LucideIcon }[] = [
    {
      label: "Registration",
      key: "startsAt",
      icon: Clock,
    },
    {
      label: "Review",
      key: "reviewAt",
      icon: ArrowRight,
    },
    {
      label: "Voting",
      key: "votingAt",
      icon: ArrowRight,
    },
    {
      label: "Results",
      key: "resultAt",
      icon: ArrowRight,
    },
    {
      label: "Payout",
      key: "payoutAt",
      icon: ArrowRight,
    },
  ];

  return (
    <Meta className="overflow-x-auto">
      {phases.map((phase, i) => (
        <div key={i} className="flex items-center gap-2">
          <MetaIcon as={phase.icon} />
          <div className="px-4">
            <div className="text-center text-xs uppercase">{phase.label}</div>
            <div className="whitespace-nowrap">
              {formatDate(round[phase.key] as Date)}
            </div>
          </div>
        </div>
      ))}
    </Meta>
  );
}
