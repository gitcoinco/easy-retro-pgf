import Head from "next/head";
import { metadata } from "~/config";
import Image from "next/image";
import Link from "next/link";

export default function HomePage({}) {
  return (
    <div>
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
          content="https://github.com/gitcoinco/easy-retro-pgf"
        />
        <meta property="twitter:url" content={metadata.url} />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />
      </Head>
      <div className="">
        <Image
          className="w-full object-cover filter"
          src="/banner.png"
          alt="Image"
          layout="fill"
        />
        <div className="absolute top-[60%] left-[45%] flex w-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-3">
          <Link href="/builderIdeas" className=" rounded-full bg-onPrimary-light px-8 py-4 text-scrim-dark hover:bg-primary-dark">
            Explore Ideas
          </Link>
          <Link href="/projects" className="rounded-full bg-onPrimary-light px-8 py-4 text-scrim-dark hover:bg-primary-dark">
            RetroPGF Round1
          </Link>
        </div>
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
