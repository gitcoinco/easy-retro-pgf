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

const QuadraticTooltip = () =>
  <div className="relative group">
    {/* <img src="./HelpIcon.svg" alt="help icon" /> */}
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_4473_5604)">
        <path d="M11.8335 18H13.8335V16H11.8335V18ZM12.8335 2C7.3135 2 2.8335 6.48 2.8335 12C2.8335 17.52 7.3135 22 12.8335 22C18.3535 22 22.8335 17.52 22.8335 12C22.8335 6.48 18.3535 2 12.8335 2ZM12.8335 20C8.4235 20 4.8335 16.41 4.8335 12C4.8335 7.59 8.4235 4 12.8335 4C17.2435 4 20.8335 7.59 20.8335 12C20.8335 16.41 17.2435 20 12.8335 20ZM12.8335 6C10.6235 6 8.8335 7.79 8.8335 10H10.8335C10.8335 8.9 11.7335 8 12.8335 8C13.9335 8 14.8335 8.9 14.8335 10C14.8335 12 11.8335 11.75 11.8335 15H13.8335C13.8335 12.75 16.8335 12.5 16.8335 10C16.8335 7.79 15.0435 6 12.8335 6Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_4473_5604">
          <rect width="24" height="24" fill="white" transform="translate(0.833496)" />
        </clipPath>
      </defs>
    </svg>
    <div className="absolute right-0 mt-2 w-72 p-6 text-sm bg-[#111f22] text-[#e1e9eb] rounded-lg  z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="font-medium font-['DM Sans']">
        <span className="font-semibold font-['DM Sans'] mb-2">Quadratic: </span>
        The voting power of each OBOL Token Delegate is proportional to the amount of OBOL tokens delegated to them. However, the funding results are calculated using quadratic funding, meaning that the square root of the votes is used to determine the final allocation. This approach ensures a broader distribution of funding across the Obol Collective, rather than allowing a small number of winners to dominate.      </p>
      <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-[#111f22] h-3 w-3 rotate-45"></div>
    </div>
  </div>

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
          className="text-[#182d32] h-10 px-6 py-3 inline-flex items-center justify-center text-center transition-colors  backdrop-blur-sm  rounded-lg duration-150 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" variant="primary" //improve this
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
              <QuadraticTooltip />
            </div>
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
