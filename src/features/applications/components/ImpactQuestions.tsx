import { createElement, FunctionComponent, ReactElement } from "react";
import { FormControl, Input, Textarea } from "~/components/ui/Form";
import { impactCategories } from "~/config";

type ImpactCategoryKeys = keyof typeof impactCategories;

type Question = {
  label: string;
  hint?: string | ReactElement;
  component: FunctionComponent;
  description?: string;
};
type ImpactCategoryQuestions = {
  [key: string]: {
    questions: {
      [key: string]: Question;
    };
  };
};
export const impactCategoryQuestions: ImpactCategoryQuestions = {
  INFRASTRUCTURE: {
    questions: {
      osoName: {
        description: `OSO allows us to extract specific metrics from your repository on
        usage and forks, allowing badgeholders a greater insight into the
        impact your project has made. We thus encourage you to take the time
        to create an oso_name.`,
        label: "Please include your oso_name.",
        hint: (
          <span>
            You can find instructions on obtaining an oso_name{" "}
            <a
              href="https://docs.opensource.observer/docs/contribute/project-data/"
              target="_blank"
              className="font-bold underline"
            >
              here
            </a>
            .{" "}
            <a
              href="https://www.notion.so/fil-retropgf/Round-2-Application-Guidelines-394969fa60cf4b45a8d8ef5cbbfd3d7e?pvs=4#11ed0d646da1806998cac03d305c3b69"
              target="_blank"
              className="font-bold underline"
            >
              <br />
              Why do we need your OSO_name?
            </a>
          </span>
        ),
        component: Input,
      },
      topProjects: {
        label:
          "Name high-impact projects dependent on your library/repository.",
        hint: "Include the names and brief descriptions of each project (Markdown is supported).",
        component: Textarea,
      },
      filecoinUsers: {
        label:
          "Describe what percentage of the network uses your implementation? ",
        hint: "Provide an estimated percentage if exact figures are not available (Markdown is supported).",
        component: Textarea,
      },
      economicContribution: {
        label:
          "How has your project contributed to growing the Filecoin economy? If possible, provide a numerical estimate.",
        hint: "You may use historical data to estimate your project's impact (Markdown is supported).",
        component: Textarea,
      },
      additionalImpact: {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "This is an open field for any extra information you'd like to share (Markdown is supported).",
        component: Textarea,
      },
    },
  },
  TOOLING: {
    questions: {
      osoName: {
        description: `OSO allows us to extract specific metrics from your repository on
            usage and forks, allowing badgeholders a greater insight into the
            impact your project has made. We thus encourage you to take the time
            to create an oso_name.`,
        label: "Please include your oso_name.",
        hint: (
          <span>
            You can find instructions on obtaining an oso_name{" "}
            <a
              href="https://docs.opensource.observer/docs/contribute/project-data/"
              target="_blank"
              className="font-bold underline"
            >
              here
            </a>
            .
            <a
              href="https://www.notion.so/fil-retropgf/Round-2-Application-Guidelines-394969fa60cf4b45a8d8ef5cbbfd3d7e?pvs=4#11ed0d646da1806998cac03d305c3b69"
              target="_blank"
              className="font-bold underline"
            >
              <br />
              Why do we need your OSO_name?
            </a>
          </span>
        ),
        component: Input,
      },
      dependentProjects: {
        label: "How does your tool or utility contribute to the FVM ecosystem?",
        hint: "Provide the names and descriptions of the top 5 projects (Markdown is supported).",
        component: Textarea,
      },
      downloads: {
        label:
          "Provide a description of usage or downloads for your tool or utility.",
        hint: "Use package statistics from npm, PyPI, etc (Markdown is supported).",
        component: Textarea,
      },
      economicContribution: {
        label:
          "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions has it supported? [If possible, provide a numerical estimate]",
        hint: "Provide a numerical estimate if possible (Markdown is supported).",
        component: Textarea,
      },
      additionalImpact: {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "This is an open field for any extra information you'd like to share (Markdown is supported).",
        component: Textarea,
      },
    },
  },
  COMMUNITY_EDUCATION: {
    questions: {
      newAddresses: {
        label:
          "What is the increase in the number of first-time Filecoin addresses as a result of your educational content?",
        hint: "Provide an estimated percentage if exact numbers are unavailable (Markdown is supported).",
        component: Textarea,
      },
      impressions: {
        label: "How many people has your content reached?",
        hint: "Provide metrics from analytics tools, if available (Markdown is supported).",
        component: Textarea,
      },
      attendees: {
        label:
          "What is the number of people graduating from your program / What is the number of people who attended your event?",
        hint: "Include data on participation and completion rates (Markdown is supported).",
        component: Textarea,
      },
      economicContribution: {
        label:
          "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions has it enabled. [If possible, provide a numerical estimate and a link]",
        hint: "If possible, provide detailed economic metrics (Markdown is supported).",
        component: Textarea,
      },
      additionalImpact: {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "(Markdown is supported).",
        component: Textarea,
      },
    },
  },
  RESEARCH_AND_DEVELOPMENT: {
    questions: {
      dependentProjects: {
        label:
          "Describe the impact of your research on the Filecoin core protocol.",
        hint: "(Markdown is supported).",
        component: Textarea,
      },
      usabilityImprovements: {
        label:
          "Describe the impact of your research on Filecoin outside of the core protocol, for example, projects building on FVM.",
        hint: "(Markdown is supported).",
        component: Textarea,
      },
      efficiencyIncrease: {
        label: "How has your research improved the Filecoin economy?",
        hint: "If possible, provide a numerical estimate and a link (Markdown is supported).",
        component: Textarea,
      },
      additionalImpact: {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "This is an open field for any extra information you'd like to share (Markdown is supported).",
        component: Textarea,
      },
    },
  },
  GOVERNANCE: {
    questions: {
      accessibility: {
        label:
          "How has your project made governance more accessible to more members of the Filecoin ecosystem?",
        hint: "Provide examples or specific outcomes (Markdown is supported).",
        component: Textarea,
      },
      governanceImpact: {
        label: "How has your governance work improved the Filecoin economy?",
        hint: "If possible, provide a numerical estimate and a link (Markdown is supported).",
        component: Textarea,
      },
      additionalImpact: {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "This is an open field for any extra information you'd like to share (Markdown is supported).",
        component: Textarea,
      },
    },
  },
  END_USER_EXPERIENCE: {
    questions: {
      caseStudies: {
        label: "Briefly share user case studies (1-3 examples, 100 words max).",
        hint: "(Markdown is supported)",
        component: Textarea,
      },
      walletInteractions: {
        label: "How many new users has your product brought to Filecoin?",
        hint: "Provide specific metrics if available (Markdown is supported).",
        component: Textarea,
      },
      userRetention: {
        label:
          "What is the average number of users retained upon interacting with your application for the first time?",
        hint: "Include user retention statistics (Markdown is supported).",
        component: Textarea,
      },
      monthlyActiveAddresses: {
        label:
          "What is the growth in the number of monthly active addresses interacting with your project?",
        hint: "Provide numerical growth data (Markdown is supported).",
        component: Textarea,
      },
      economicContribution: {
        label:
          "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions has it supported? [If possible, provide a numerical estimate]",
        hint: "If possible, include a numerical estimate (Markdown is supported).",
        component: Textarea,
      },
      additionalImpact: {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "This is an open field for any extra information you'd like to share (Markdown is supported).",
        component: Textarea,
      },
    },
  },
};

export function ImpactQuestions({
  selectedCategories,
}: {
  selectedCategories: string[];
}) {
  return (
    <div className="mt-2 space-y-2">
      {(selectedCategories as ImpactCategoryKeys[]).map((categoryKey) => (
        <CategoryQuestions key={categoryKey} categoryKey={categoryKey} />
      ))}
    </div>
  );
}

import { Accordion } from "~/components/ui/Accordion"; // Adjust the import path as needed
interface CategoryQuestionsProps {
  categoryKey: ImpactCategoryKeys;
}

export function CategoryQuestions({ categoryKey }: CategoryQuestionsProps) {
  const { questions } = impactCategoryQuestions[categoryKey] ?? {};
  if (!questions) return null;

  const { label } = impactCategories[categoryKey];

  return (
    <Accordion title={`${label} - Guide Questions`} defaultOpen={true}>
      {Object.entries(questions).map(
        ([name, { label: questionLabel, hint, component, description }]) => {
          const fieldName = `application.categoryQuestions.${categoryKey}.${name}`;
          return (
            <FormControl
              key={fieldName}
              name={fieldName}
              label={questionLabel}
              hint={hint}
              description={description}
            >
              {createElement(component)}
            </FormControl>
          );
        },
      )}
    </Accordion>
  );
}
