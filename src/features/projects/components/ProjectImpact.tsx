import { Markdown } from "~/components/ui/Markdown";
import { Heading } from "~/components/ui/Heading";
import { type Application } from "~/features/applications/types";
import { Accordion } from "~/components/ui/Accordion";
import { impactCategoryQuestions } from "~/features/applications/components/ImpactQuestions";
import { useProjectsMetrics } from "~/features/applications/hooks/useMetrics";

type Props = { isLoading: boolean; project?: Application };

export default function ProjectImpact({ isLoading, project }: Props) {
  const categoryQuestions = project?.categoryQuestions;

  let oso_name = null;

  if (categoryQuestions && typeof categoryQuestions === "object") {
    const targetCategories = ["INFRASTRUCTURE", "TOOLING"];

    const categoryKey = targetCategories.find(
      (key) => key in categoryQuestions,
    );
    if (categoryKey && categoryQuestions[categoryKey]) {
      const categoryAnswers = categoryQuestions[categoryKey];
      oso_name = categoryAnswers["osoName"] || null;
    }
  }

  console.log("OSO Name:", oso_name);
  // ipfs should be replaced with the oso_name variable
  const metrics = useProjectsMetrics("ipfs");

  const data = metrics.data ? mapMetricsToData(metrics.data) : [];

  return (
    <div className="mt-8">
      <div className="rounded-md bg-white shadow-sm">
        {/* Impact Heading */}
        <Heading as="h3" size="xl" className="mb-6">
          Impact
        </Heading>

        {/* Impact Description */}
        {project?.impactDescription && data.length == 0 ? (
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
                <MetricsBox label="Impact Metrics" data={data} />
              </div>
            </div>
          )
        )}

        {/* Impact Metrics Questions */}
        {project?.impactCategory &&
          Object.entries(categoryQuestions ?? {}).length > 0 && (
            <div>
              <Heading as="h4" size="lg" className="mb-4">
                Impact Category Questions
              </Heading>
              <div className="space-y-6">
                {project.impactCategory.map((categoryKey, i) => (
                  <Accordion key={i} title={categoryKey}>
                    {categoryQuestions &&
                      Object.entries(categoryQuestions[categoryKey] ?? {}).map(
                        ([questionKey, answer], j) => (
                          <div key={j} className="mb-6">
                            <Heading
                              as="h6"
                              size="md"
                              className="mb-2 text-gray-700"
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

// Assuming you have the following import for your ImpactMetrics type
import type { ImpactMetrics } from "~/utils/fetchMetrics";
import { ReactNode } from "react";
import { MetricsBox } from "./MetricsBox";

// Helper function to map metrics data to an array of label-value pairs
function mapMetricsToData(
  metrics: ImpactMetrics,
): { label: string; value: ReactNode }[] {
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
