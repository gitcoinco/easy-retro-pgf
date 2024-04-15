import type { ReactNode, PropsWithChildren } from "react";
import { useAccount } from "wagmi";

import Header from "~/components/Header";
import BallotOverview from "~/features/ballot/components/BallotOverview";
import { BaseLayout, type LayoutProps } from "./BaseLayout";
import {
  useCurrentDomain,
  useCurrentRound,
} from "~/features/rounds/hooks/useRound";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/Button";
import Link from "next/link";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;
export const Layout = ({ children, ...props }: Props) => {
  const { address } = useAccount();

  const domain = useCurrentDomain();
  const { data: round, isPending } = useCurrentRound();

  const navLinks = [
    {
      href: `/${domain}/projects`,
      children: `Projects`,
    },
  ];

  if (useRoundState() === "RESULTS") {
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
  const { address } = useAccount();
  const { data: session } = useSession();
  return (
    <Layout
      sidebar="left"
      sidebarComponent={address && session && <BallotOverview />}
      {...props}
    />
  );
}
