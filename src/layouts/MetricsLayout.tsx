import type { ReactNode, PropsWithChildren } from "react";
import Header from "~/components/Header";
import { BaseLayout, type LayoutProps } from "./BaseLayout";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { useCurrentUser } from "~/hooks/useCurrentUser";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;

export const MetricsLayout = ({ children, ...props }: Props) => {
  const domain = useCurrentDomain();
  const { isAdmin, isVoter } = useCurrentUser();

  const navLinks = [
    {
      href: `/${domain}`,
      children: `Round`,
    },
    {
      href: `/${domain}/metrics`,
      children: `Metrics`,
    },
  ];

  if (isVoter) {
    navLinks.push({
      href: `/${domain}/ballot/metrics`,
      children: `Ballot`,
    });
  }

  if (isAdmin) {
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
