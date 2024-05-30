import { Heading } from "~/components/ui/Heading";
import { LinkBox } from "./LinkBox";
import { FileCode, Github, Globe, type LucideIcon } from "lucide-react";
import { createElement } from "react";
import { type Application } from "~/features/applications/types";

type Props = { isLoading: boolean; project?: Application };

export default function ProjectContributions({ isLoading, project }: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row items-baseline md:items-center justify-between pt-6">
        <div className="flex md:w-2/3 flex-col items-start justify-between gap-3">
        <Heading className="m-0" as="h3" size="lg">
        Contributions
      </Heading>
        <p dangerouslySetInnerHTML={{ __html: project?.contributionDescription }} className="editorClasses break-words text-sm font-normal">
        </p>
        </div>
        <div className="md:w-1/3 w-full">
          <LinkBox
            label="Contribution Links"
            links={project?.contributionLinks}
            renderItem={(link) => {
              const icon: LucideIcon | undefined = {
                CONTRACT_ADDRESS: FileCode,
                GITHUB_REPO: Github,
                OTHER: Globe,
              }[link.type];
              return (
                <>
                  {createElement(icon ?? "div", {
                    className: "w-4 h-4 ",
                  })}
                  <div className="flex-1 truncate" title={link.description}>
                    {link.description}
                  </div>
                </>
              );
            }}
          />
        </div>
    </div>
  );
}
