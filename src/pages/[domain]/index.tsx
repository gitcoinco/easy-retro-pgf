import type { GetServerSidePropsContext } from "next";
import { Layout } from "~/layouts/DefaultLayout";
import { Markdown } from "~/components/ui/Markdown";
import { Button } from "~/components/ui/Button";
import Link from "next/link";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { RoundProgress } from "~/features/info/components/RoundProgress";
import { Banner } from "~/components/ui/Banner";
import { CircleDollarSign, Globe, Plus } from "lucide-react";
import { networkNames } from "~/config";
import { createComponent } from "~/components/ui";
import { tv } from "tailwind-variants";
import { useRoundToken } from "~/features/distribute/hooks/useAlloPool";
import { Skeleton } from "~/components/ui/Skeleton";

export default function RoundPage() {
  const { data, isPending } = useCurrentRound();

  const { startsAt, reviewAt, votingAt, resultAt, payoutAt } = data ?? {};
  const steps = [];
  if (startsAt) steps.push({ label: "Registration", date: startsAt });
  if (reviewAt) steps.push({ label: "Review & Approval", date: reviewAt });
  if (votingAt) steps.push({ label: "Voting", date: votingAt });
  if (resultAt) steps.push({ label: "Tallying", date: resultAt });
  if (payoutAt) steps.push({ label: "Distribution", date: payoutAt });

  const { bannerImageUrl, network } = data ?? {};
  return (
    <Layout>
      <div className="mb-2 flex items-center justify-between gap-4">
        <Skeleton className="h-12 w-full" isLoading={isPending}>
          <h1 className="text-4xl font-semibold">{data?.name}</h1>
        </Skeleton>
        <Button
         className="text-[#182d32] h-10 px-6 py-3 inline-flex items-center justify-center text-center transition-colors  backdrop-blur-sm  rounded-lg duration-150 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:ring-offset-gray-800" variant="primary" //improve this
          as={Link}
          href={`/${data?.domain}/applications/new`}
        >
          Apply
        </Button>
      </div>
      <div className="mb-4 flex gap-16">
        <Meta>
          <MetaLabel>Network</MetaLabel>
          <Skeleton isLoading={isPending}>
            <div>{network && networkNames[network]}</div>
          </Skeleton>
        </Meta>
        <Meta>
          <MetaLabel>Token</MetaLabel>
          <Skeleton isLoading={isPending}>
            <TokenSymbol />
          </Skeleton>
        </Meta>
        <Meta>
          <MetaLabel>Calculation</MetaLabel>
          <Skeleton isLoading={isPending} className="h-7">
            {data?.calculationType?.toUpperCase()}
          </Skeleton>
        </Meta>
      </div>
      <Banner size="lg" src={bannerImageUrl} />
      {data && <RoundProgress steps={steps} />}
      <Markdown>{data?.description}</Markdown>
    </Layout>
  );
}
function TokenSymbol() {
  const token = useRoundToken();
  return <>{token.data?.symbol}</>;
}
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { domain } = ctx.query;
  return { props: { domain } };
};

const Meta = createComponent(
  "div",
  tv({ base: "flex flex-col text-gray-600 font-semibold text-xl" }),
);
const MetaLabel = createComponent(
  "div",
  tv({ base: "uppercase text-sm font-normal" }),
);
