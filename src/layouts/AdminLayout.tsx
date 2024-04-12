import type { ReactNode, PropsWithChildren } from "react";

import { type LayoutProps } from "./BaseLayout";
import { Layout } from "./DefaultLayout";
import { useIsAdmin } from "~/hooks/useIsAdmin";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;
export const AdminLayout = ({ children, ...props }: Props) => {
  const isAdmin = useIsAdmin();
  return (
    <Layout {...props}>
      {isAdmin ? (
        children
      ) : (
        <div className="py-16 text-center">
          Not authorized to view this page
        </div>
      )}
    </Layout>
  );
};
