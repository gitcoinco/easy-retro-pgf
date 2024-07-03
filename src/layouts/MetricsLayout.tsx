import type { ReactNode, PropsWithChildren } from "react";
import Header from "~/components/Header";
import { BaseLayout, type LayoutProps } from "./BaseLayout";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;

export const MetricsLayout = ({ children, ...props }: Props) => {
  const domain = useCurrentDomain();

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
