import { Heading } from "~/components/ui/Heading";
import type { Application } from "~/features/applications/types";
import ProjectContributions from "./ProjectContributions";
import ProjectImpact from "./ProjectImpact";

type Props = {
  isLoading: boolean;
  impactMetrics: {
    description: Application["impactDescription"];
    metrics: Application["impactMetrics"];
  };
  contributions: {
    description: Application["contributionDescription"];
    links: Application["contributionLinks"];
  };
};

export function ImpactStatements({
  isLoading,
  impactMetrics,
  contributions,
}: Props) {
  return (
    <>
      <Heading as="h2" size="3xl">
        Impact statements
      </Heading>

      <ProjectContributions isLoading={isLoading} {...contributions} />

      <ProjectImpact isLoading={isLoading} {...impactMetrics} />
    </>
  );
}
