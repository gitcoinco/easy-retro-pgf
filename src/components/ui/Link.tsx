import NextLink from "next/link";
import { type ComponentProps } from "react";
import { tv } from "tailwind-variants";

import { createComponent } from ".";
import clsx from "clsx";
import { ExternalLinkIcon } from "lucide-react";

export const Link = createComponent(
  NextLink,
  tv({
    base: "font-semibold underline-offset-2 hover:underline text-secondary-600",
  }),
);

export const ExternalLink = ({
  children,
  ...props
}: ComponentProps<typeof NextLink>) => (
  <NextLink
    target="_blank"
    className={clsx("flex items-center gap-2 font-semibold hover:underline")}
    {...props}
  >
    {children} <ExternalLinkIcon className=" h-4 w-4" />
  </NextLink>
);
