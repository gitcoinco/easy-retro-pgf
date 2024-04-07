import type { GetServerSidePropsContext } from "next";
import { Layout } from "~/layouts/DefaultLayout";
import { Markdown } from "~/components/ui/Markdown";
import { Button } from "~/components/ui/Button";
import Link from "next/link";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { RoundProgress } from "~/features/info/components/RoundProgress";
import Image from "next/image";
import { cn } from "~/utils/classNames";
import { Banner } from "~/components/ui/Banner";

export default function RoundPage() {
  const round = useCurrentRound();

  const { startsAt, reviewAt, votingAt, resultAt, payoutAt } = round.data ?? {};
  const steps = [];
  if (startsAt) steps.push({ label: "Registration", date: startsAt });
  if (reviewAt) steps.push({ label: "Review & Approval", date: reviewAt });
  if (votingAt) steps.push({ label: "Voting", date: votingAt });
  if (resultAt) steps.push({ label: "Tallying", date: resultAt });
  if (payoutAt) steps.push({ label: "Distribution", date: payoutAt });

  const { bannerImageUrl } = round.data ?? {};
  return (
    <Layout>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-4xl font-semibold">{round.data?.name}</h1>
        <Button
          as={Link}
          variant="primary"
          href={`/${round.data?.domain}/applications/new`}
        >
          Apply with your project
        </Button>
      </div>
      <Banner size="lg" src={bannerImageUrl} />
      {round.data && <RoundProgress steps={steps} />}
      <Markdown>{round.data?.description}</Markdown>
    </Layout>
  );
}
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { domain } = ctx.query;
  return { props: { domain } };
};
