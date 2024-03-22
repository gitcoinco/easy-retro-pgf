import { Markdown } from "~/components/ui/Markdown";
import { Heading } from "~/components/ui/Heading";
import { LinkBox } from "./LinkBox";
import { suffixNumber } from "~/utils/suffixNumber";
import { type Application } from "~/features/applications/types";

type Props = { isLoading: boolean; project?: Application };

export default function ProjectImpact({ isLoading, project }: Props) {
  return (
    <>
      <Heading as="h3" size="2xl">
        Impact
      </Heading>
      <div className="flex gap-4">
        <div className="md:w-2/3">
          <Markdown isLoading={isLoading}>
            {project?.impactDescription}
          </Markdown>
        </div>
        <div className="md:w-1/3">
          <LinkBox
            label="Impact Metrics"
            links={project?.impactMetrics}
            renderItem={(link) => (
              <>
                <div className="flex-1 truncate" title={link.description}>
                  {link.description}
                </div>
                <div className="font-medium">{suffixNumber(link.number)}</div>
              </>
            )}
          />
        </div>
      </div>
    </>
  );
}
