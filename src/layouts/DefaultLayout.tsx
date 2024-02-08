import clsx from "clsx";
import type { ReactNode, PropsWithChildren } from "react";
import { useAccount } from "wagmi";

import { Header } from "~/components/Header";
import BallotOverview from "~/features/ballot/components/BallotOverview";
import { BaseLayout, type LayoutProps } from "./BaseLayout";
import { getAppState } from "~/utils/state";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;
export const Layout = ({
  sidebar,
  sidebarComponent,
  children,
  ...props
}: Props) => {
  const appState = getAppState();

  const navLinks = [
    {
      href: "/projects",
      children: "Projects",
    },
  ];

  if (appState === "RESULTS") {
    navLinks.push({
      href: "/stats",
      children: "Stats",
    });
  }

  const wrappedSidebar = <Sidebar side={sidebar}>{sidebarComponent}</Sidebar>;

  return (
    <BaseLayout
      {...props}
      sidebar={sidebar}
      sidebarComponent={wrappedSidebar}
      header={<Header navLinks={navLinks} />}
    >
      {children}
    </BaseLayout>
  );
};

export function LayoutWithBallot(props: Props) {
  const { address } = useAccount();
  return (
    <Layout
      sidebar="left"
      sidebarComponent={address && <BallotOverview />}
      {...props}
    />
  );
}

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
