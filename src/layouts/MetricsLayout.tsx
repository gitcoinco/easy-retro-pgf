import type { ReactNode, PropsWithChildren } from "react";
import Header from "~/components/Header";
import { BaseLayout, type LayoutProps } from "./BaseLayout";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { MetricsSidebar } from "~/features/metrics/components/MetricsSidebar";

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
  ];

  return (
    <BaseLayout {...props} header={<Header navLinks={navLinks} />}>
      <div className="mx-auto mb-24 flex max-w-screen-lg gap-8 px-4 pb-32 pt-16">
        <section className="flex-1 space-y-6">{children}</section>
        <aside>
          <MetricsSidebar />
        </aside>
      </div>
    </BaseLayout>
  );
};
