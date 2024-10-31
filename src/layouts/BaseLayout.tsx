import clsx from "clsx";
import Head from "next/head";
import {
  type ReactNode,
  type PropsWithChildren,
  createContext,
  useContext,
} from "react";
import { useAccount } from "wagmi";

import { useRouter } from "next/router";
import { metadata } from "~/config";
import { useTheme } from "next-themes";
import { Footer } from "~/components/LoadingPage";

const Context = createContext({ eligibilityCheck: false, showBallot: false });
export const useLayoutOptions = () => useContext(Context);

export type LayoutProps = {
  customClassName?: string,
  title?: string;
  requireAuth?: boolean;
  eligibilityCheck?: boolean;
  showBallot?: boolean;
};
export const BaseLayout = ({
  customClassName,
  header,
  title,
  sidebar,
  sidebarComponent,
  requireAuth,
  eligibilityCheck = false,
  showBallot = false,
  children,
}: PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
    header?: ReactNode;
  } & LayoutProps
>) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { address, isConnecting } = useAccount();

  if (requireAuth && !address && !isConnecting) {
    void router.push("/");
    return null;
  }

  const wrappedSidebar = <Sidebar side={sidebar}>{sidebarComponent}</Sidebar>;

  title = title ? `${title} - ${metadata.title}` : metadata.title;
  return (
    <Context.Provider value={{ eligibilityCheck, showBallot }}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="favicon.svg" />
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
      <div
        className={clsx(
          "flex h-full px-3 md:px-20 min-h-screen flex-1 flex-col",
          theme,
        )}
      >
        {header}
        <div className="mx-auto w-full flex-1 pt-8 2xl:container md:flex">
          {sidebar === "left" ? wrappedSidebar : null}
          <div
            className={clsx(customClassName,
              {
                ["w-full min-w-0 mx-0 md:!ml-[80px] pb-24"]: !customClassName && sidebar,
                ["w-full min-w-0 mx-auto max-w-5xl pb-24"]: !sidebar && !customClassName,
              })}
          >
            {children}
          </div>
          {sidebar === "right" ? wrappedSidebar : null}
        </div>
        <Footer />
      </div>
    </Context.Provider>
  );
};

const Sidebar = ({
  side,
  ...props
}: { side?: "left" | "right" } & PropsWithChildren) => (
  <div>
    <div
      className={clsx("px-2 md:w-[336px] md:px-4", {
        ["left-0 top-[2rem] md:sticky"]: side === "left",
      })}
      {...props}
    />
  </div>
);
