import Link from "next/link";
import { useRouter } from "next/router";
import { type ComponentPropsWithRef, useState } from "react";
import clsx from "clsx";

import { ConnectButton } from "./ConnectButton";
import { IconButton } from "./ui/Button";
import { config } from "~/config";
import { Menu, X } from "lucide-react";

const Logo = () => (
  <div className="h-10">
    {config.logoUrl ? (
      <img className="max-h-full" src={config.logoUrl} />
    ) : (
      <div className="flex h-full w-24 items-center justify-center rounded-full border-2 border-dashed border-white text-xs font-medium tracking-wider text-white">
        Open RPGF
      </div>
    )}
  </div>
);

const navLinks = [
  {
    href: "/projects",
    children: "Projects",
    type: "projects",
  },
  {
    href: "/lists",
    children: "Lists",
    type: "lists",
  },
] as const;

const NavLink = ({
  isActive,
  ...props
}: { isActive: boolean } & ComponentPropsWithRef<typeof Link>) => (
  <Link
    className={clsx(
      "flex h-full items-center border-b-[3px] border-transparent p-4 font-semibold text-gray-400 hover:text-white",
      {
        ["!border-white  !text-white"]: isActive,
      },
    )}
    {...props}
  />
);

export const Header = () => {
  const { asPath } = useRouter();
  const [isOpen, setOpen] = useState(false);

  return (
    <header className="relative z-[100] bg-gray-900 shadow-md dark:shadow-none">
      <div className="container mx-auto flex h-[72px] max-w-screen-2xl items-center px-2">
        <div className="mr-4 flex items-center md:mr-16">
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
        <div className="hidden h-full items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <NavLink
              isActive={asPath.startsWith(link.href)}
              key={link.href}
              href={link.href}
            >
              {link.children}
            </NavLink>
          ))}
        </div>
        <div className="flex-1 md:ml-8"></div>
        <div className="ml-4 flex gap-4 md:ml-8 xl:ml-32">
          <ConnectButton />
        </div>
        <MobileMenu isOpen={isOpen} />
      </div>
    </header>
  );
};

const MobileMenu = ({ isOpen = false }) => (
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
        className={clsx("block p-4 text-2xl  font-semibold")}
        key={link.href}
        {...link}
      />
    ))}
  </div>
);
