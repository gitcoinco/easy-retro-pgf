import Link from "next/link";
import Image from "next/image";
import { Layout } from "~/layouts/DefaultLayout";
import { Markdown } from "~/components/ui/Markdown";
import { Button } from "~/components/ui/Button";
import { Chip } from "~/components/ui/Chip";

export default function HomePage({}) {
  return (
    <Layout isFullWidth>
      <div className="flex w-full flex-col items-center  justify-start  md:flex-row ">
        <div className="flex flex-col gap-6 px-5 pb-5 pt-0 md:w-1/2 md:p-7 lg:gap-8 xl:p-20">
          <Markdown>{`### Retroactive POKT Goods Funding`}</Markdown>
          <div className="flex flex-col items-center justify-between gap-3 leading-relaxed lg:text-xl">
            <p>
              Retroactive funding is a novel mechanism for reducing the gap
              between impact and rewards through the introduction of a third
              variable - time.
            </p>
            <p>
              POKT Network has been the recipient of retroactive rewards and is
              now redistributing these funds via our own retroactive grants
              program. POKT DAO wants to create a domino effect, ensuring funds
              aren't captured in companies or DAO treasuries but instead make
              their way into the hands of the people who directly created
              impact.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Chip
              className="gap-2 px-8 py-4 md:px-14 md:py-4 lg:px-16 text-base font-semibold"
              as={Link}
              target="_blank"
              href="https://docs.pokt.network/community/retro-pokt-goods-funding"
            >
              Docs
            </Chip>

            <Link
              href="/projects"
              className="rounded-full bg-onPrimary-light px-8 py-4 font-semibold text-scrim-dark hover:bg-primary-dark"
            >
              Round 1
            </Link>
          </div>
        </div>
        <div className=" md:w-1/2">
          <Image
            className="w-full"
            src="/homeAsset.png"
            alt="Image"
            height={600}
            width={680}
          />
        </div>
      </div>
    </Layout>
  );
}
