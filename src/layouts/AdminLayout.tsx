import type { ReactNode, PropsWithChildren } from "react";
import { useSession } from "next-auth/react";
import { type LayoutProps } from "./BaseLayout";
import { Layout } from "./DefaultLayout";
import { InvalidAdmin } from "~/features/admin/components/InvalidAdmin";
import { useIsAdmin } from "~/hooks/useIsAdmin";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;
export const AdminLayout = ({ children, ...props }: Props) => {
  const { data } = useSession();
  const isAdmin = useIsAdmin();
  if (data && isAdmin) {
    return <Layout {...props}>{children}</Layout>;
  }

  return (
    <Layout {...props}>
      <InvalidAdmin />
    </Layout>
  );
};
