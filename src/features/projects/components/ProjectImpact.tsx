import { Markdown } from "~/components/ui/Markdown";
import { Heading } from "~/components/ui/Heading";
import { type Application } from "~/features/applications/types";
import { Accordion } from "~/components/ui/Accordion";
import { impactCategoryQuestions } from "~/features/applications/components/ImpactQuestions";

type Props = { isLoading: boolean; project?: Application };

export default function ProjectImpact({ isLoading, project }: Props) {
  const categoryQuestions = project?.categoryQuestions;

  return (
    <div className="mt-8">
      <div className="rounded-md bg-white shadow-sm">
        {/* Impact Heading */}
        <Heading as="h3" size="xl" className="mb-6">
          Impact
        </Heading>

        {/* Impact Description */}
        {project?.impactDescription && (
          <div className="mb-8">
            <div className="prose max-w-none">
              <Markdown isLoading={isLoading}>
                {project.impactDescription}
              </Markdown>
            </div>
          </div>
        )}

        {/* Impact Metrics Questions */}
        {project?.impactCategory && Object.entries(categoryQuestions ?? {}).length > 0 && (
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
