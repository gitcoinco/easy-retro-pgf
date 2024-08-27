import { Markdown } from "~/components/ui/Markdown";
import { Heading } from "~/components/ui/Heading";
import { type Application } from "~/features/applications/types";
import Links from "./Links";

type Props = { isLoading: boolean; project?: Application };

export default function ProjectContributions({ isLoading, project }: Props) {
  return (
    <>
      <Heading as="h3" size="2xl">
        Contributions
      </Heading>
      <div className="mb-4 flex flex-col gap-4 md:flex-row">
        <div className="md:w-2/3">
          <Markdown isLoading={isLoading}>
            {project?.contributionDescription}
          </Markdown>
        </div>
        <Links label="Contribution Links" links={project?.contributionLinks} />
      </div>
    </>
  );
}
