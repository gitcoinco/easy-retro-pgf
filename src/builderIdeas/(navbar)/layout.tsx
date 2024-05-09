import Navbar from "../component/navbar/Navbar";
import Head from "next/head";
import { metadata } from "~/config";

export default function Layout({
  children,
  title,
}: Readonly<{
  children: React.ReactNode;
  title?: string;
}>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={`${metadata.url}/favicon.svg`} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:domain"
          content="https://github.com/gitcoinco/easy-retro-pgf"
        />
        <meta property="twitter:url" content={metadata.url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />
      </Head>
      <div className="">
        <div className="z-40">
          <Navbar />
        </div>
        {children}
      </div>
    </>
  );
}
