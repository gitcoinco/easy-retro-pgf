"use client";

import type { ReactNode, PropsWithChildren } from "react";

import Header from "~/components/Header";
import BallotOverview from "~/features/ballot/components/BallotOverview";
import { BaseLayout, type LayoutProps } from "./BaseLayout";
import {
  useCurrentDomain,
  useCurrentRound,
} from "~/features/rounds/hooks/useRound";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import { Button } from "~/components/ui/Button";
import Link from "next/link";
import { RoundTypes } from "~/features/rounds/types";
import { useSessionAddress } from "~/hooks/useSessionAddress";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;
export const Layout = ({ children, ...props }: Props) => {
  const { address } = useSessionAddress();

  const domain = useCurrentDomain();
  const { data: round, isPending } = useCurrentRound();
  const roundState = useRoundState();

  const navLinks: {
    href: string;
    children: string;
  }[] = [];

  if (round && round.type !== RoundTypes.impact) {
    navLinks.push({
      href: `/${domain}/projects`,
      children: `Projects`,
    });
  }

  if (round && round.type === RoundTypes.impact && roundState === "VOTING") {
    navLinks.push({
      href: `/${domain}/metrics`,
      children: `Voting`,
    });
  }

  if (roundState === "RESULTS") {
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

    if (["TALLYING" || "RESULTS"].includes(roundState!)) {
      navLinks.push(
        ...[
          {
            href: `/${domain}/admin/distribute`,
            children: `Distribute`,
          },
        ],
      );
    }
  }

  if (!isPending && !round) {
    return (
      <BaseLayout>
        <div className="flex flex-col items-center gap-4 py-8">
          Round not found
          <Button as={Link} href={"/"}>
            Go home
          </Button>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout {...props} header={<Header navLinks={navLinks} />}>
      {children}
    </BaseLayout>
  );
};

export function LayoutWithBallot(props: Props) {
  const { address } = useSessionAddress();
  return (
    <Layout
      sidebar="left"
      sidebarComponent={address && <BallotOverview />}
      {...props}
    />
  );
}
