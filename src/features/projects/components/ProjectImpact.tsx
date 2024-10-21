import { Markdown } from "~/components/ui/Markdown";
import { Heading } from "~/components/ui/Heading";
import { type Application } from "~/features/applications/types";
import { Accordion } from "~/components/ui/Accordion";
import { impactCategoryQuestions } from "~/features/applications/components/ImpactQuestions";
import { useProjectsMetrics } from "~/features/applications/hooks/useMetrics";
import type { ImpactMetrics } from "~/utils/fetchMetrics";
import { MetricsBox } from "./MetricsBox";
import { suffixNumber } from "~/utils/suffixNumber";
import { LinkBox } from "./LinkBox";
type Props = { isLoading: boolean; project?: Application };

export default function ProjectImpact({ isLoading, project }: Props) {
  const categoryQuestions = project?.categoryQuestions;

  let oso_name = null;
  let categoryHasOsoName = false;

  if (categoryQuestions && typeof categoryQuestions === "object") {
    const targetCategories = ["INFRASTRUCTURE", "TOOLING"];

    const categoryKey = targetCategories.find(
      (key) => key in categoryQuestions,
    );
    if (categoryKey && categoryQuestions[categoryKey]) {
      categoryHasOsoName = true;
      const categoryAnswers = categoryQuestions[categoryKey];
      oso_name = categoryAnswers["osoName"] || null;
      oso_name = oso_name === "" ? null : oso_name;
    }
  }

  const metrics = useProjectsMetrics(oso_name ?? "");

  const data = metrics.data ? mapMetricsToData(metrics.data) : ([] as any);

  const roundOneMetrics = project?.impactMetrics;

  const showOnlyImpactDescription =
    project?.impactDescription &&
    !roundOneMetrics &&
    data.length === 0 &&
    !oso_name;

  return (
    <div className="mt-8">
      <div className="rounded-md bg-white shadow-sm">
        {/* Impact Heading */}
        <Heading as="h3" size="xl" className="mb-4">
          Project Impact
        </Heading>
        <hr className="mb-8 mt-2" />

        {/* Impact Description */}
        {showOnlyImpactDescription ? (
          <div className="mb-8">
            <div className="prose max-w-none">
              <Markdown isLoading={isLoading}>
                {project.impactDescription}
              </Markdown>
            </div>
          </div>
        ) : (
          project?.impactDescription && (
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="md:w-2/3">
                <Markdown isLoading={isLoading}>
                  {project.impactDescription}
                </Markdown>
              </div>
              <div className="md:w-1/3">
                {categoryHasOsoName && oso_name ? (
                  <MetricsBox label="Impact Metrics" data={data} />
                ) : (
                  roundOneMetrics && (
                    <LinkBox
                      label="Impact Metrics"
                      links={roundOneMetrics as any[]}
                      renderItem={(link) => (
                        <>
                          <div
                            className="flex-1 truncate"
                            title={link.description}
                          >
                            {link.description}
                          </div>
                          <div className="font-medium">
                            {suffixNumber(link.number)}
                          </div>
                        </>
                      )}
                    />
                  )
                )}
              </div>
            </div>
          )
        )}

        {/* Impact Metrics Questions */}
        {project?.impactCategory &&
          Object.entries(categoryQuestions ?? {}).length > 0 && (
            <div className="mt-8">
              <Heading as="h3" size="xl" className="mb-4">
                Category-specific impact
              </Heading>
              <hr className="mb-8 mt-2" />

              <div className="space-y-6">
                {project.impactCategory.map((categoryKey, i) => (
                  <Accordion key={i} title={categoryKey}>
                    {categoryQuestions &&
                      Object.entries(categoryQuestions[categoryKey] ?? {})
                        .filter(([questionKey, _]) => questionKey !== "osoName")
                        .map(([questionKey, answer], j) => (
                          <div key={j} className="mb-6">
                            <Heading
                              as="h6"
                              size="md"
                              className="mb-2 text-gray-900"
                            >
                              {
                                impactCategoryQuestions[categoryKey]?.questions[
                                  questionKey
                                ]?.label
                              }
                            </Heading>
                            <div className="prose max-w-none">
                              <Markdown>{answer}</Markdown>
                            </div>
                          </div>
                        ),
                      )}
                  </Accordion>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function mapMetricsToData(
  metrics: ImpactMetrics,
): { label: string; value: string | number }[] {
  return [
    { label: "Star Count", value: metrics.starCount },
    { label: "Fork Count", value: metrics.forkCount },
    { label: "Contributor Count", value: metrics.contributorCount },
    {
      label: "Contributors (Last 6 Months)",
      value: metrics.contributorCount6Months,
    },
    {
      label: "New Contributors (Last 6 Months)",
      value: metrics.newContributorCount6Months,
    },
    { label: "First Commit Date", value: metrics.firstCommitDate },
    {
      label: "Active Developers (Last 6 Months)",
      value: metrics.activeDeveloperCount6Months,
    },
  ];
}
