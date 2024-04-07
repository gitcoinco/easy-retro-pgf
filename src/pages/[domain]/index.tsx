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

export default function RoundPage() {
  const round = useCurrentRound();

  const { startsAt, reviewAt, votingAt, resultAt, payoutAt } = round.data ?? {};
  const steps = [];
  if (startsAt) steps.push({ label: "Registration", date: startsAt });
  if (reviewAt) steps.push({ label: "Review & Approval", date: reviewAt });
  if (votingAt) steps.push({ label: "Voting", date: votingAt });
  if (resultAt) steps.push({ label: "Tallying", date: resultAt });
  if (payoutAt) steps.push({ label: "Distribution", date: payoutAt });

  const { bannerImageUrl, network } = round.data ?? {};
  return (
    <Layout>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-4xl font-semibold">{round.data?.name}</h1>
        <Button
          icon={Plus}
          as={Link}
          href={`/${round.data?.domain}/applications/new`}
        >
          Apply with your project
        </Button>
      </div>
      <div className="mb-4 flex gap-16">
        <Meta>
          <MetaLabel>Network</MetaLabel>
          <div>{network ? networkNames[network] : "not set"}</div>
        </Meta>
        <Meta>
          <MetaLabel>Token</MetaLabel>
          <TokenSymbol />
        </Meta>
        <Meta>
          <MetaLabel>Calculation</MetaLabel>
          {round.data?.calculationType?.toUpperCase()}
        </Meta>
      </div>
      <Banner size="lg" src={bannerImageUrl} />
      {round.data && <RoundProgress steps={steps} />}
      <Markdown>{round.data?.description}</Markdown>
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
