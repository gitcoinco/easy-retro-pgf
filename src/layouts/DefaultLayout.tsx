import clsx from "clsx";
import { type PropsWithChildren } from "react";
import { useAccount } from "wagmi";

import { useRouter } from "next/router";
import { Header } from "~/components/Header";
import { BallotOverview } from "~/features/ballot/components/BallotOverview";
import { BaseLayout } from "./BaseLayout";

const navLinks = [
  {
    href: "/projects",
    children: "Projects",
  },
  {
    href: "/lists",
    children: "Lists",
  },
];
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
  const router = useRouter();
  const { address, isConnecting } = useAccount();

  if (requireAuth && !address && !isConnecting) {
    void router.push("/");
    return null;
  }

  const sidebarComponent = (
    <Sidebar side={sidebar}>{address ? <BallotOverview /> : null}</Sidebar>
  );

  return (
    <BaseLayout
      title={title}
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
