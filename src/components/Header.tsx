import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { type ComponentPropsWithRef, useState } from "react";
import clsx from "clsx";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { ConnectButton } from "./ConnectButton";
import { IconButton } from "./ui/Button";
import { config, metadata } from "~/config";
import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useIsAdmin } from "~/hooks/useIsAdmin";

const Logo = () => (
  <div>
    <Image
      className="max-h-full scale-75"
      width={144}
      height={48}
      alt="logo"
      src={config.logoUrl}
    />
  </div>
);

const NavLink = ({
  isActive,
  ...props
}: { isActive: boolean } & ComponentPropsWithRef<typeof Link>) => (
  <Link
    className={clsx(
      "flex h-full items-center border-b-[3px] border-transparent p-4 font-semibold  text-onPrimary-light hover:text-primary-dark",
      {
        ["  !text-primary-dark"]: isActive,
      },
    )}
    {...props}
  />
);

type NavLink = { href: string; children: string };
export const Header = ({
  navLinks,
  address,
}: {
  navLinks: NavLink[];
  address: `0x${string}` | undefined;
}) => {
  const { asPath } = useRouter();
  const [isOpen, setOpen] = useState(false);
  const isAdmin = useIsAdmin();

  return (
    <header className="relative z-10 bg-background-dark shadow-md dark:shadow-none">
      <div className="container mx-auto flex h-[72px] max-w-screen-2xl items-center px-2">
        <div className="mr-4 flex items-center xl:mr-16">
          <IconButton
            icon={isOpen ? X : Menu}
            variant="ghost"
            className="mr-1 text-gray-600 md:hidden"
            onClick={() => setOpen(!isOpen)}
          />
          <Link href={"/"}>
            <Logo />
          </Link>
        </div>
        <div className="hidden h-full items-center gap-2 overflow-x-auto md:flex xl:gap-4">
          {navLinks?.map((link) => (
            <NavLink
              isActive={
                link?.href?.length > 0 &&
                link.href !== "/" &&
                asPath.startsWith(link.href)
              }
              key={link.href}
              href={link.href}
              data-tooltip-id={link.children}
            >
              {link.children}
            </NavLink>
          ))}
        </div>
        {(address === undefined || !isAdmin) && (
          <ReactTooltip
            id="Voting"
            place="bottom"
            className="max-h-full max-w-[20rem] bg-outline-dark"
            multiline={true}
            style={{ backgroundColor: "#6c7283" }}
            content={
              <div className="flex flex-col text-wrap">
                <span>Voting hasn't started yet</span>
              </div>
            }
          />
        )}
        <div className="flex-1 md:ml-8"></div>
        <div className=" flex gap-4 md:ml-8 xl:ml-32">
          <ConnectButton />
        </div>
        <MobileMenu
          isAdmin={isAdmin}
          address={address}
          isOpen={isOpen}
          navLinks={navLinks}
        />
      </div>
    </header>
  );
};

const MobileMenu = ({
  isOpen,
  navLinks,
  address,
  isAdmin,
}: {
  isOpen?: boolean;
  navLinks: NavLink[];
  address: `0x${string}` | undefined;
  isAdmin: boolean;
}) => (
  <div
    className={clsx(
      "fixed left-0 top-16 z-10 h-full w-full bg-white transition-transform duration-150 dark:bg-surfaceContainerLow-dark",
      {
        ["translate-x-full"]: !isOpen,
      },
    )}
  >
    {navLinks.map((link) => (
      <Link
        className={clsx("block p-4 text-2xl  font-semibold")}
        key={link.href}
        data-tooltip-id={link.children}
        {...link}
      />
    ))}
    {(address === undefined || !isAdmin) && (
      <ReactTooltip
        id="Voting"
        place="bottom"
        className="max-h-full max-w-[20rem] bg-outline-dark"
        style={{ backgroundColor: "#6c7283" }}
        multiline={true}
        content={
          <div className="flex flex-col text-wrap">
            <span>Voting hasn't started yet</span>
          </div>
        }
      />
    )}
  </div>
);

export default dynamic(async () => Header, { ssr: false });
