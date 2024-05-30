import { Heading } from "~/components/ui/Heading";
import { LinkBox } from "./LinkBox";
import { suffixNumber } from "~/utils/suffixNumber";
import { type Application } from "~/features/applications/types";

type Props = { isLoading: boolean; project?: Application };

export default function ProjectImpact({ isLoading, project }: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row items-baseline md:items-center justify-between pt-6">
              <div className="flex md:w-2/3 flex-col items-start justify-between gap-3">

              <Heading className="m-0" as="h3" size="lg">
        Impact
      </Heading>
      <p className=" break-words text-sm font-normal">
            {project?.impactDescription}
          </p>
        </div>
        <div className="md:w-1/3 w-full">
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
  );
}
