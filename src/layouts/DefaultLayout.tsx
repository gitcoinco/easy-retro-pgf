import clsx from "clsx";
import Head from "next/head";
import { type PropsWithChildren } from "react";
import { useAccount } from "wagmi";

import { useRouter } from "next/router";
import { Header } from "~/components/Header";
import { metadata } from "~/config";
import { BallotOverview } from "~/features/ballot/components/BallotOverview";
import { useTheme } from "next-themes";

export const Layout = ({
  sidebar,
  title,
  requireAuth,
  children,
}: PropsWithChildren<{
  sidebar?: "left" | "right";
  title?: string;
  requireAuth?: boolean;
}>) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { address, isConnecting } = useAccount();

  if (requireAuth && !address && !isConnecting) {
    void router.push("/");
    return null;
  }

  const sidebarComponent = (
    <Sidebar side={sidebar}>
      <BallotOverview />
    </Sidebar>
  );

  title = title ? `${title} - ${metadata.title}` : metadata.title;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metadata.description} />

        <meta property="og:url" content={metadata.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="optimism.io" />
        <meta property="twitter:url" content={metadata.url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />
      </Head>
      <div
        className={clsx("min-h-screen dark:bg-gray-900 dark:text-white", theme)}
      >
        <Header />
        <div className="mx-auto pt-12  2xl:container md:flex">
          {sidebar === "left" ? sidebarComponent : null}
          <div
            className={clsx("min-w-0 flex-1 px-2 pb-24", {
              ["mx-auto max-w-5xl"]: !sidebar,
            })}
          >
            {children}
          </div>
          {sidebar === "right" ? sidebarComponent : null}
        </div>
      </div>
    </>
  );
};

const Sidebar = (props: { side?: "left" | "right" } & PropsWithChildren) => (
  <div>
    <div
      className={clsx("px-2 md:w-[336px] md:px-4", {
        ["left-0 top-[2rem] md:sticky"]: props.side === "left",
      })}
      {...props}
    />
  </div>
);
