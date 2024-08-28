import { useMemo } from "react";
import { FileCode, Globe } from "lucide-react";
import { SiGithub as Github, SiX as Twitter } from "react-icons/si"; // Importing from simple-icons

import { type Application } from "~/features/applications/types";
import type { IconType } from "~/types";
import { LinkBox } from "./LinkBox";

type Props = {
  label: string;
  links?: Application["contributionLinks"];
  showUrl?: boolean;
};

function parseProfileUrl({
  url,
  type,
}: {
  url: string;
  type: "github" | "twitter" | "x";
}): string {
  // this function is to check if the url contains only the profile id
  // returns the full url
  const prefixes = {
    github: "https://github.com/",
    twitter: "https://twitter.com/",
    x: "https://x.com/",
  };
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `${prefixes[type]}${url}`;
  }
  return url;
}

function parseLinks(
  links: Application["contributionLinks"] = [],
): Application["contributionLinks"] {
  return links?.map((link) => {
    switch (link.type.toUpperCase()) {
      case "GITHUB_REPO":
      case "GITHUB REPO":
        const url = parseProfileUrl({ url: link.url, type: "github" });
        return { ...link, url, type: "GITHUB_REPO" };
      case "OTHER":
        if (link.description.toUpperCase() === "TWITTER PROFILE") {
          const url = parseProfileUrl({ url: link.url, type: "twitter" });

          return { ...link, url, type: "TWITTER" };
        }
        return link;
      default:
        return link;
    }
  });
}

const iconMap: Record<string, IconType> = {
  CONTRACT_ADDRESS: FileCode,
  GITHUB_REPO: Github,
  TWITTER: Twitter,
  OTHER: Globe,
};

export default function Links({ label, links, showUrl }: Props) {
  const parsedLinks = useMemo(() => parseLinks(links), [links]);

  return (
    <LinkBox
      label={label}
      links={parsedLinks}
      renderItem={(link) => {
        const IconComponent = iconMap[link.type.toUpperCase()];
        return (
          <>
            {IconComponent ? (
              <IconComponent className="mt-1 h-4 w-4" />
            ) : (
              <div className="mt-1 h-4 w-4" /> // Fallback to empty div with same dimensions
            )}
            <div className="flex-1 truncate" title={link.url}>
              {showUrl && link.description === "Website"
                ? link.url
                : link.description}
            </div>
          </>
        );
      }}
    />
  );
}
