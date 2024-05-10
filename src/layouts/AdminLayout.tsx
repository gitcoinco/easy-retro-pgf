import type { ReactNode, PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
import { type LayoutProps } from "./BaseLayout";
import { config } from "~/config";
import { Layout } from "./DefaultLayout";
import { InvalidAdmin } from "~/features/admin/components/InvalidAdmin";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;
export const AdminLayout = ({ children, ...props }: Props) => {
  const { data } = useSession();
  if (data && config.admins.includes(data.address as `0x${string}`)) {
    return <Layout {...props}>{children}</Layout>;
  }

  return (
    <Layout {...props}>
      <InvalidAdmin />
    </Layout>
  );
};
