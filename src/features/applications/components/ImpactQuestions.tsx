import { createElement, FunctionComponent, ReactElement } from "react";
import { FormControl, Input, Textarea } from "~/components/ui/Form";
import { impactCategories } from "~/config";

type ImpactCategoryKeys = keyof typeof impactCategories;

type Question = {
  label: string;
  hint?: string | ReactElement;
  component: FunctionComponent;
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
          </span>
        ),
        component: Input,
      },
      topProjects: {
        label:
          "Name the top 5 high-impact projects dependent on your library/repository.",
        hint: "Include the names and brief descriptions of each project (Markdown is supported).",
        component: Textarea,
      },
      filecoinUsers: {
        label:
          "What is the percentage of Filecoin users (or percentage of the network) that run on your implementation?",
        hint: "Provide an estimated percentage if exact figures are not available (Markdown is supported).",
        component: Textarea,
      },
      economicContribution: {
        label:
          "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions does your library support? [If possible, provide a numerical estimate]",
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
          </span>
        ),
        component: Input,
      },
      dependentProjects: {
        label:
          "How many FVM projects are dependent on your project? Name the top 5 high-impact projects dependent on your tool.",
        hint: "Provide the names and descriptions of the top 5 projects (Markdown is supported).",
        component: Textarea,
      },
      downloads: {
        label:
          "How many times has an SDK or package developed by your project been downloaded?",
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
        label:
          "What is the total number of impressions your content has received? What is the feedback score you have received?",
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
          "Describe the impact of your research on the Filecoin core protocol. You can reference features that added utility, increased or efficiency.",
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
        label:
          "How many new users has your product brought to Filecoin?",
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
      {(selectedCategories as ImpactCategoryKeys).map((categoryKey) => (
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
        ([name, { label: questionLabel, hint, component }]) => {
          const fieldName = `application.categoryQuestions.${categoryKey}.${name}`;
          return (
            <FormControl
              key={fieldName}
              name={fieldName}
              label={questionLabel}
              hint={hint}
            >
              {createElement(component)}
            </FormControl>
          );
        },
      )}
    </Accordion>
  );
}
