import type { GetServerSidePropsContext } from "next";
import { Layout } from "~/layouts/DefaultLayout";
import { Markdown } from "~/components/ui/Markdown";
import { Button } from "~/components/ui/Button";
import { Tooltip } from "~/components/ui/Tooltip";
import Link from "next/link";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { RoundProgress } from "~/features/info/components/RoundProgress";
import { Banner } from "~/components/ui/Banner";
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
          className="text-secondary-600 h-10 px-6 py-3 inline-flex items-center justify-center text-center transition-colors  backdrop-blur-sm  rounded-lg duration-150 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" variant="primary" //improve this
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
          <Skeleton isLoading={isPending}>
            <div className="relative flex items-center space-x-1">
              <span className="text-lg font-semibold">Quadratic</span>
              <Tooltip>
                <p>
                  <span className="font-medium font-['DM Sans'] mb-2">Quadratic: </span>
                  The voting power of each OBOL Token Delegate is proportional to the amount of OBOL tokens delegated to them. However, the funding results are calculated using quadratic funding, meaning that the square root of the votes is used to determine the final allocation. This approach ensures a broader distribution of funding across the Obol Collective, rather than allowing a small number of winners to dominate.
                </p></Tooltip>            </div>
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
  return <>OBOL</>;
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
