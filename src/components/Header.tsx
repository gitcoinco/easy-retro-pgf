import Link from "next/link";
import { useRouter } from "next/router";
import { type ComponentPropsWithRef, useState, useRef } from "react";
import clsx from "clsx";
import { ConnectButton } from "./ConnectButton";
import { IconButton } from "./ui/Button";
import { config, metadata } from "~/config";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import dynamic from "next/dynamic";
import ReactDOM from "react-dom";
import useIsMobile from "./hooks/useIsMobile";
import useAnchorPosition from "./hooks/useAnchorPosition";

const Logo = () => (
  <div className="h-10">
    {config.logoUrl ? (
      <img className="size-10" src={config.logoUrl} />
    ) : (
      <div className="flex h-full items-center justify-center rounded-full border-2 border-dashed border-white px-4 text-xs font-medium tracking-wider text-white">
        {metadata.title}
      </div>
    )}
  </div>
);

const Dropdown = ({
  isOpen,
  anchorRef,
  items,
  onClose,
  isMobile,
}: {
  isOpen: boolean | undefined;
  anchorRef: any;
  items: { key: string; label: string; href: string }[];
  onClose: (() => void) | undefined;
  isMobile?: boolean;
}) => {
  const position = useAnchorPosition(anchorRef);
  const router = useRouter();

  if (!isOpen) return null;

  return isMobile ? (
    <div
      className={clsx("mt-2 flex w-48 flex-wrap rounded-md shadow-lg", {
        " z-50 ": isMobile,
        "pl-8": isMobile,
      })}
      style={{ display: "block", top: "100%" }}
    >
      <div className="shadow-xs rounded-md bg-white">
        <div className="py-1">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  ) : (
    ReactDOM.createPortal(
      <ul
        className="absolute z-50 rounded-md border border-gray-300 bg-white shadow-lg"
        style={{
          top: `${position?.top}px`,
          left: `${position?.left}px`,
        }}
      >
        {items.map((item) => (
          <li
            key={item.key}
            className="cursor-pointer rounded-md px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onClose?.();
              router.push(item.href);
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>,
      document.body,
    )
  );
};

const NavLink = ({
  isActive,
  href,
  children,
  hasDropdown,
  onToggleDropdown,
  isDropdownOpen,
  isMobile,
  dropdownItems,
  ...props
}: {
  isActive: boolean;
  href: string;
  children: string;
  hasDropdown?: boolean;
  onToggleDropdown?: () => void;
  isDropdownOpen?: boolean;
  isMobile?: boolean;
  dropdownItems?: { key: string; label: string; href: string }[];
} & ComponentPropsWithRef<typeof Link>) => {
  const anchorRef = useRef(null);

  return (
    <div
      className={clsx("relative flex ", {
        "flex-col items-start border-b border-gray-200": isMobile,
      })}
      ref={anchorRef}
    >
      <div className="flex flex-row items-center justify-between">
        <Link
          className={clsx(
            "flex h-full items-center border-b-[3px] border-transparent p-4 font-semibold text-black/40 hover:text-primary-600",
            {
              ["!border-white  !text-black"]: isActive,
            },
          )}
          href={href}
          {...props}
        >
          {children}
        </Link>
        {hasDropdown && (
          <button
            className="ml-2 p-2 focus:outline-none"
            onClick={onToggleDropdown}
          >
            {isDropdownOpen ? (
              <ChevronUp className="text-black/40 hover:text-primary-600" />
            ) : (
              <ChevronDown className="text-black/40 hover:text-primary-600" />
            )}
          </button>
        )}
      </div>

      {hasDropdown && (
        <Dropdown
          isOpen={isDropdownOpen}
          anchorRef={anchorRef}
          items={dropdownItems || []}
          onClose={onToggleDropdown}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

type NavLinkType = {
  href: string;
  children: string;
  dropdownItems?: { key: string; label: string; href: string }[];
};

const NavLinks = ({
  navLinks,
  isDropdownOpen,
  handleToggleDropdown,
  isMobile,
}: {
  navLinks: NavLinkType[];
  isDropdownOpen: string | null;
  handleToggleDropdown: (href: string) => void;
  isMobile?: boolean;
}) => {
  const { asPath } = useRouter();

  return (
    <>
      {navLinks.map((link) => (
        <NavLink
          isActive={asPath.startsWith(link.href)}
          key={link.href}
          href={link.href}
          hasDropdown={!!link.dropdownItems}
          onToggleDropdown={() => handleToggleDropdown(link.href)}
          isDropdownOpen={isDropdownOpen === link.href}
          isMobile={isMobile}
          dropdownItems={link.dropdownItems}
        >
          {link.children}
        </NavLink>
      ))}
    </>
  );
};

export const Header = ({ navLinks }: { navLinks: NavLinkType[] }) => {
  const [isOpen, setOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const handleToggleDropdown = (href: string) => {
    setDropdownOpen(isDropdownOpen === href ? null : href);
  };

  const isMobile = useIsMobile(768, (isCurrentlyMobile) => {
    if (!isCurrentlyMobile) {
      setOpen(false);
    }
  });

  return (
    <header className="relative z-10">
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
        {!isMobile && (
          <div className="hidden h-full items-center gap-4 overflow-x-auto md:flex">
            <NavLinks
              navLinks={navLinks}
              isDropdownOpen={isDropdownOpen}
              handleToggleDropdown={handleToggleDropdown}
            />
          </div>
        )}
        <div className="flex-1 md:ml-8"></div>
        <div className="ml-4 flex gap-4 md:ml-8 xl:ml-32">
          <ConnectButton />
        </div>
        {isMobile && (
          <MobileMenu
            isOpen={isOpen}
            navLinks={navLinks}
            handleToggleDropdown={handleToggleDropdown}
            isDropdownOpen={isDropdownOpen}
          />
        )}
      </div>
    </header>
  );
};

const MobileMenu = ({
  isOpen,
  navLinks,
  handleToggleDropdown,
  isDropdownOpen,
}: {
  isOpen?: boolean;
  navLinks: NavLinkType[];
  handleToggleDropdown: (href: string) => void;
  isDropdownOpen: string | null;
}) => {
  return (
    <div
      className={clsx(
        "fixed left-0 top-16 z-10 h-full w-full bg-white transition-transform duration-150 dark:bg-gray-900",
        { ["translate-x-full"]: !isOpen },
      )}
    >
      <NavLinks
        navLinks={navLinks}
        isDropdownOpen={isDropdownOpen}
        handleToggleDropdown={handleToggleDropdown}
        isMobile
      />
    </div>
  );
};

export default dynamic(async () => Header, { ssr: false });
