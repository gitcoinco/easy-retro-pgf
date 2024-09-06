import { useRouter } from "next/router";
import { useMemo } from "react";

type NavLinkType = {
  href: string;
  children: string;
  onlyDropdown?: boolean;
  dropdownItems?: { key: string; label: string; href: string }[];
};

export const useActiveNavLink = (navLinks: NavLinkType[]) => {
  const { asPath } = useRouter();

  // Step 1: Create a mapping of all hrefs used in dropdowns
  const dropdownHrefMap = useMemo(() => {
    const map = new Set<string>();
    navLinks.forEach((link) => {
      if (link.dropdownItems) {
        link.dropdownItems.forEach((item) => {
          if (asPath.includes(item.key)) {
            map.add(link.href);
          }
        });
      }
    });
    return map;
  }, [asPath, navLinks]);

  // Step 2: Determine if a link is active
  const isLinkActive = (link: NavLinkType): boolean => {
    // Check if the link has dropdown items and if any item.key of them match the current path
    const isDropdownActive =
      link.dropdownItems &&
      link.dropdownItems.some((item) => asPath.includes(item.key));

    // Check if the current link's href is also used in a dropdown
    const isInDropdown = dropdownHrefMap.has(link.href);

    // Determine if the current link should be active
    return isDropdownActive
      ? true // Mark the dropdown link as active if any of its items are active
      : asPath.startsWith(link.href) && !isInDropdown && !link.dropdownItems; // Only mark non-dropdown links as active if they are not in the dropdown map
  };

  return { isLinkActive };
};
