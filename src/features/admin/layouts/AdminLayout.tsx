import { type Round } from "@prisma/client";
import { type UseTRPCQueryResult } from "@trpc/react-query/shared";
import {
  ChevronLeft,
  Coins,
  Files,
  Pencil,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { createElement, type ReactNode } from "react";
import { useAccount } from "wagmi";
import { Spinner } from "~/components/ui/Spinner";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { Layout } from "~/layouts/DefaultLayout";
import { cn } from "~/utils/classNames";

export function RoundAdminLayout({
  children,
  className,
  ...props
}: {
  sidebarComponent?: ReactNode;
  className?: string;
  title?: string;
  children: (params: UseTRPCQueryResult<Round | null, unknown>) => ReactNode;
}) {
  const { address } = useAccount();
  const round = useCurrentRound();

  return (
    <Layout sidebarComponent={<RoundConfigSidebar />} sidebar="left" {...props}>
      <div className={className}>
        {round.isLoading ? (
          <div className="flex flex-col items-center gap-2 py-12">
            <div>Loading round...</div>
            <Spinner className="size-6" />
          </div>
        ) : !round.data?.admins.includes(address!) ? (
          <div>Only admins can access this page</div>
        ) : (
          children(round)
        )}
      </div>
    </Layout>
  );
}

function RoundConfigSidebar() {
  const pathname = usePathname();
  const domain = useRouter().query.domain as string;
  const menu = [
    {
      children: "Home",
      icon: ChevronLeft,
      href: `/${domain}`,
    },
    {
      children: "Round details",
      description: "Configure name, description & dates",
      icon: Pencil,
      href: `/${domain}/admin`,
    },
    {
      children: "Network & Token",
      description: "Configure the payout token and calculations",
      icon: Settings2,
      href: `/${domain}/admin/token`,
    },
    {
      children: "Admin accounts",
      description: "Set admin accounts",
      icon: ShieldCheck,
      href: `/${domain}/admin/accounts`,
    },
    {
      children: "Voters",
      description: "Add voters and configure vote settings",
      icon: Users,
      href: `/${domain}/admin/voters`,
    },
    {
      children: "Applications",
      description: "Review and approve registered applications",
      icon: Files,
      href: `/${domain}/admin/applications`,
    },
    {
      children: "Distribute",
      description: "Transfer tokens to the projects",
      icon: Coins,
      href: `/${domain}/admin/distribute`,
    },
  ];
  return (
    <div className="space-y-1">
      {menu.map((item) => {
        const isActive = item.href === pathname;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
              {
                ["bg-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-700"]:
                  isActive,
              },
            )}
          >
            <div className="flex gap-2">
              {createElement(item.icon, { className: "size-4 mt-1" })}
              <div>
                {item.children}
                <div className="text-xs dark:text-gray-300">
                  {item.description}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
