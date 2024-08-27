import { LinkBox } from "./LinkBox";
import { FileCode, Github, Globe, type LucideIcon } from "lucide-react";
import { createElement } from "react";
import { type Application } from "~/features/applications/types";

type Props = {
  label: string;
  links?: Application["contributionLinks"];
};

export default function Links({ label, links }: Props) {
  return (
    <div className="md:w-1/3">
      <LinkBox
        label={label}
        links={links}
        renderItem={(link) => {
          const icon: LucideIcon | undefined = {
            CONTRACT_ADDRESS: FileCode,
            GITHUB_REPO: Globe, // Find the correct icon for this
            OTHER: Globe,
          }[link.type.toUpperCase()];
          return (
            <>
              {createElement(icon ?? "div", {
                className: "w-4 h-4 mt-1",
              })}
              <div className="flex-1 truncate" title={link.description}>
                {link.description}
              </div>
            </>
          );
        }}
      />
    </div>
  );
}
