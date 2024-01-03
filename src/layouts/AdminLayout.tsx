import { type PropsWithChildren } from "react";

import { BaseLayout, type LayoutProps } from "./BaseLayout";
import { Header } from "~/components/Header";

const navLinks = [
  {
    href: "/applications",
    children: "Applications",
  },
  {
    href: "/voters",
    children: "Voters",
  },
];

export const AdminLayout = ({
  children,
  ...props
}: PropsWithChildren<
  {
    sidebar?: "left" | "right";
  } & LayoutProps
>) => {
  return (
    <BaseLayout {...props} header={<Header navLinks={navLinks} />}>
      {children}
    </BaseLayout>
  );
};
