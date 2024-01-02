import { useAccount } from "wagmi";
import { type PropsWithChildren } from "react";
import { useRouter } from "next/router";

import { BaseLayout } from "./BaseLayout";
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
  title,
  requireAuth,
  children,
}: PropsWithChildren<{
  sidebar?: "left" | "right";
  title?: string;
  requireAuth?: boolean;
}>) => {
  const router = useRouter();
  const { address, isConnecting } = useAccount();

  if (requireAuth && !address && !isConnecting) {
    void router.push("/");
    return null;
  }

  return (
    <BaseLayout title={title} header={<Header navLinks={navLinks} />}>
      {children}
    </BaseLayout>
  );
};
