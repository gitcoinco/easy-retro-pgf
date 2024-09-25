import Link from "next/link";
import { useRouter } from "next/router";
import {
  type ComponentPropsWithRef,
  useState,
  useRef,
  MutableRefObject,
} from "react";
import clsx from "clsx";
import { ConnectButton } from "./ConnectButton";
import { IconButton } from "./ui/Button";
import { config, metadata } from "~/config";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import dynamic from "next/dynamic";
import ReactDOM from "react-dom";
import useIsMobile from "./hooks/useIsMobile";
import useAnchorPosition from "./hooks/useAnchorPosition";
import { useActiveNavLink } from "./hooks/useActiveNavLink";
import { useClickAway } from "react-use"; // Import the useClickAway hook

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
  handleToggleMenu,
  isMobile,
}: {
  isOpen: boolean | undefined;
  anchorRef: MutableRefObject<HTMLElement | null>;
  items: { key: string; label: string; href: string }[];
  onClose: (() => void) | undefined;
  handleToggleMenu?: () => void;
  isMobile?: boolean;
}) => {
  const position = useAnchorPosition(anchorRef);
  const router = useRouter();
  const { asPath } = router;

  if (!isOpen) return null;

  return isMobile ? (
    <div
      className={"z-50 mt-2  flex flex-wrap items-start rounded-md shadow-md"}
      style={{ display: "block", top: "100%" }}
    >
      <div className="shadow-xs rounded-md bg-white">
        <div className="py-1">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="block items-center justify-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onClose?.();
                handleToggleMenu?.();
              }}
            >
              {asPath.includes(item.key) && (
                <span className="mr-2 text-sm text-blue-500">✔</span>
              )}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  ) : (
    ReactDOM.createPortal(
      <ul
        className="absolute z-50 flex flex-col items-center rounded-md border border-gray-300 bg-white shadow-lg"
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
            {asPath.includes(item.key) && (
              <span className="mr-2 text-sm text-blue-500">✔</span>
            )}
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
  handleToggleMenu,
  isDropdownOpen,
  isMobile,
  dropdownItems,
  onlyDropdown,
  ...props
}: {
  isActive: boolean;
  href: string;
  children: string;
  hasDropdown?: boolean;
  onToggleDropdown?: () => void;
  handleToggleMenu?: () => void;
  isDropdownOpen?: boolean;
  isMobile?: boolean;
  dropdownItems?: { key: string; label: string; href: string }[];
  onlyDropdown?: boolean;
} & ComponentPropsWithRef<typeof Link>) => {
  const anchorRef = useRef(null);
  const router = useRouter();

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
            "flex h-full items-center border-b-[3px] border-transparent p-2 font-semibold text-black/40 hover:text-primary-600",
            {
              ["!border-white  !text-black"]: isActive,
            },
          )}
          href={onlyDropdown ? router.asPath : href}
          onClick={() => {
            !onlyDropdown && handleToggleMenu?.();
            onlyDropdown && onToggleDropdown?.();
          }}
          {...props}
        >
          {children}
        </Link>
        {hasDropdown && (
          <button className="focus:outline-none" onClick={onToggleDropdown}>
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
          handleToggleMenu={handleToggleMenu}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

type NavLinkType = {
  href: string;
  children: string;
  onlyDropdown?: boolean;
  dropdownItems?: { key: string; label: string; href: string }[];
};

const NavLinks = ({
  navLinks,
  isDropdownOpen,
  handleToggleDropdown,
  handleToggleMenu,
  isMobile,
}: {
  navLinks: NavLinkType[];
  isDropdownOpen: string | null;
  handleToggleDropdown: (href: string) => void;
  handleToggleMenu?: () => void;
  isMobile?: boolean;
}) => {
  const { isLinkActive } = useActiveNavLink(navLinks); // Use the custom hook

  return (
    <>
      {navLinks.map((link) => (
        <NavLink
          isActive={isLinkActive(link)} // Determine if the link is active using the hook
          key={link.href}
          href={link.href}
          hasDropdown={!!link.dropdownItems}
          onToggleDropdown={() => handleToggleDropdown(link.href)}
          handleToggleMenu={handleToggleMenu}
          isDropdownOpen={isDropdownOpen === link.href}
          isMobile={isMobile}
          dropdownItems={link.dropdownItems}
          onlyDropdown={link.onlyDropdown}
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
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = () => {
    setOpen(!open);
  };

  const handleToggleDropdown = (href: string) => {
    setDropdownOpen(isDropdownOpen === href ? null : href);
  };

  const isMobile = useIsMobile(1000, (isCurrentlyMobile) => {
    if (!isCurrentlyMobile) {
      setOpen(false);
    }
  });

  useClickAway(drawerRef, () => setOpen(false));

  return (
    <header className="relative z-50">
      <div className="container mx-auto flex h-[72px] max-w-screen-2xl items-center px-2">
        <div
          className={clsx("mr-4 flex items-center", {
            ["mr-16"]: isMobile,
          })}
        >
          <IconButton
            icon={isOpen ? X : Menu}
            variant="ghost"
            className={clsx("mr-1 text-gray-600 ", {
              ["hidden"]: !isMobile,
            })}
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
            handleToggleMenu={handleToggleMenu}
            navLinks={navLinks}
            handleToggleDropdown={handleToggleDropdown}
            isDropdownOpen={isDropdownOpen}
            drawerRef={drawerRef}
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
  handleToggleMenu,
  drawerRef,
}: {
  isOpen?: boolean;
  navLinks: NavLinkType[];
  handleToggleDropdown: (href: string) => void;
  isDropdownOpen: string | null;
  handleToggleMenu: () => void;
  drawerRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      ref={drawerRef}
      className={clsx(
        "fixed left-0 top-16 z-10 h-full border bg-white transition-transform duration-150 dark:bg-gray-900",
        { ["translate-x-auto w-[40%]"]: isOpen, ["hidden"]: !isOpen },
      )}
    >
      <NavLinks
        navLinks={navLinks}
        isDropdownOpen={isDropdownOpen}
        handleToggleDropdown={handleToggleDropdown}
        handleToggleMenu={handleToggleMenu}
        isMobile
      />
    </div>
  );
};

export default dynamic(async () => Header, { ssr: false });
