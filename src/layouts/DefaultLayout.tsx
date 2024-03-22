import type { ReactNode, PropsWithChildren } from "react";
import { useAccount } from "wagmi";

import Header from "~/components/Header";
import BallotOverview from "~/features/ballot/components/BallotOverview";
import { BaseLayout, type LayoutProps } from "./BaseLayout";
import { getAppState } from "~/utils/state";
import { useRouter } from "next/router";
import {
  useCurrentDomain,
  useCurrentRound,
} from "~/features/rounds/hooks/useRound";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;
export const Layout = ({ children, ...props }: Props) => {
  const { address } = useAccount();

  const domain = useCurrentDomain();
  const { data: round } = useCurrentRound();
  const navLinks = [
    {
      href: `/${domain}/projects`,
      children: `Projects`,
    },
    {
      href: `/${domain}/lists`,
      children: `Lists`,
    },
  ];

  if (getAppState() === "RESULTS") {
    navLinks.push({
      href: `/${domain}/stats`,
      children: `Stats`,
    });
  }

  if (round?.admins.includes(address!)) {
    navLinks.push(
      ...[
        {
          href: `/${domain}/admin`,
          children: `Admin`,
        },
      ],
    );
  }

  return (
    <BaseLayout {...props} header={<Header navLinks={navLinks} />}>
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
