import type { ReactNode, PropsWithChildren } from "react";
import Header from "~/components/Header";
import { BaseLayout, type LayoutProps } from "./BaseLayout";
import {
  useCurrentDomain,
  useCurrentRound,
} from "~/features/rounds/hooks/useRound";
import { useAccount } from "wagmi";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;

export const MetricsLayout = ({ children, ...props }: Props) => {
  const domain = useCurrentDomain();
  const { address } = useAccount();
  const { data: round, isPending } = useCurrentRound();

  const navLinks = [
    {
      href: `/${domain}/metrics`,
      children: `Metrics`,
    },
    {
      href: `/${domain}/ballot/metrics`,
      children: `Ballot`,
    },
  ];

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
    <BaseLayout
      sidebar="right"
      {...props}
      header={<Header navLinks={navLinks} />}
    >
      {children}
    </BaseLayout>
  );
};
