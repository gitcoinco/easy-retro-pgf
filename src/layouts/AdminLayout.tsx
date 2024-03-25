import type { ReactNode, PropsWithChildren } from "react";
import { useAccount } from "wagmi";

import { type LayoutProps } from "./BaseLayout";
import { config } from "~/config";
import { Layout } from "./DefaultLayout";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;
export const AdminLayout = ({ children, ...props }: Props) => {
  const { address } = useAccount();

  if (config.admins.includes(address!)) {
    return <div>Only admins can access this page</div>;
  }

  return <Layout {...props}>{children}</Layout>;
};
