import clsx from "clsx";
import { type PropsWithChildren } from "react";
import { useAccount } from "wagmi";

import { Header } from "~/components/Header";
import BallotOverview from "~/features/ballot/components/BallotOverview";
import { BaseLayout, type LayoutProps } from "./BaseLayout";
import { getAppState } from "~/utils/state";

export const Layout = ({
  sidebar,
  children,
  ...props
}: PropsWithChildren<
  {
    sidebar?: "left" | "right";
  } & LayoutProps
>) => {
  const { address } = useAccount();
  const navLinks = [
    {
      href: "/projects",
      children: "Projects",
    },
  ];

  if (getAppState() === "RESULTS") {
    navLinks.push({
      href: "/stats",
      children: "Stats",
    });
  }

  const sidebarComponent = (
    <Sidebar side={sidebar}>{address ? <BallotOverview /> : null}</Sidebar>
  );

  return (
    <BaseLayout
      {...props}
      sidebar={sidebar}
      sidebarComponent={sidebarComponent}
      header={<Header navLinks={navLinks} />}
    >
      {children}
    </BaseLayout>
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
