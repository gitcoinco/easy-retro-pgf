import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Markdown } from "~/components/ui/Markdown";
import { metadata } from "~/config";

export default function HomePage({}) {
  return (
    <div className="flex min-h-screen flex-col bg-background-dark">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={`${metadata.url}/favicon.svg`} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:domain"
          content="https://github.com/Microflow-xyz/retroactive-pokt-goods-funding"
        />
        <meta property="twitter:url" content={metadata.url} />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />
      </Head>
      <Image
        className="relative max-h-36 w-full"
        src="/banner.jpeg"
        alt="Image"
        height={150}
        width={1269}
      />

      <div className="flex w-full flex-col  md:flex-row items-center justify-start ">
        <div className="flex lg:w-1/2 flex-col gap-6 lg:gap-8 p-5 md:p-8 lg:p-20">
          <Markdown>{`### Retroactive POKT Goods Funding`}</Markdown>
          <div className="flex flex-col items-center justify-between gap-3 lg:text-xl leading-relaxed">
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
            <Link
              href="https://docs.pokt.network/community/retro-pokt-goods-funding"
              target="_blank"
              className=" rounded-full bg-onPrimary-light px-8 py-4 font-semibold text-scrim-dark hover:bg-primary-dark"
            >
              Round 1 details
            </Link>
            <Link
              href="/projects"
              className="rounded-full bg-onPrimary-light px-8 py-4 font-semibold text-scrim-dark hover:bg-primary-dark"
            >
              Round 1
            </Link>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async () => ({
//   redirect: {
//     destination: "/home",
//     permanent: false,
//   },
// });
