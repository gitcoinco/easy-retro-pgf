import Link from "next/link";
import { useRouter } from "next/router";
import { type ComponentPropsWithRef, useState } from "react";
import clsx from "clsx";

import { ConnectButton } from "./ConnectButton";
import { IconButton } from "./ui/Button";
import { metadata } from "~/config";
import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";

const Logo = () => (
  <div className="">
    <div className="flex h-full items-center justify-center rounded-full border-2 border-white  bg-gray-800 px-4 py-2 text-base font-medium tracking-wider text-white hover:bg-gray-700">
      {metadata.title}
    </div>
  </div>
);

const NavLink = ({
  isActive,
  ...props
}: { isActive: boolean } & ComponentPropsWithRef<typeof Link>) => (
  <Link
    className={clsx(
      "flex items-center rounded-lg border-b-[3px] border-transparent px-6 py-2 font-semibold text-gray-600 transition-colors hover:bg-primary-100 hover:text-primary-800",
      {
        ["!border-white bg-primary-100 text-primary-700"]: isActive,
      },
    )}
    {...props}
  />
);

type NavLink = { href: string; children: string };
export const Header = ({ navLinks }: { navLinks: NavLink[] }) => {
  const { asPath } = useRouter();
  const [isOpen, setOpen] = useState(false);

  return (
    <header className="relative z-10">
      <div className="container mx-auto flex h-[72px] max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <IconButton
            icon={isOpen ? X : Menu}
            variant="ghost"
            className="mr-1 text-gray-600 md:hidden"
            onClick={() => setOpen(!isOpen)}
          />
          <Link href={"/"} className="py-4">
            <Logo />
          </Link>
        </div>
        <div className="hidden h-full items-center gap-2 overflow-x-auto md:flex">
          {navLinks?.map((link) => (
            <NavLink
              isActive={asPath.startsWith(link.href)}
              key={link.href}
              href={link.href}
            >
              {link.children}
            </NavLink>
          ))}
        </div>
        <ConnectButton />
        <MobileMenu isOpen={isOpen} navLinks={navLinks} />
      </div>
    </header>
  );
};

const MobileMenu = ({
  isOpen,
  navLinks,
}: {
  isOpen?: boolean;
  navLinks: NavLink[];
}) => (
  <div
    className={clsx(
      "fixed left-0 top-16 z-10 h-full w-full bg-white transition-transform duration-150 dark:bg-gray-900",
      {
        ["translate-x-full"]: !isOpen,
      },
    )}
  >
    {navLinks.map((link) => (
      <Link
        className={clsx("block p-4 text-2xl font-semibold")}
        key={link.href}
        {...link}
      />
    ))}
  </div>
);

export default dynamic(async () => Header, { ssr: false });
