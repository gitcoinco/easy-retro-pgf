import { ChevronDown, ChevronUp } from "lucide-react";
import {
  createElement,
  FunctionComponent,
  ReactElement,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/Button";
import { FormControl, Input, Textarea } from "~/components/ui/Form";
import { impactCategories } from "~/config";

type ImpactCategoryKeys = keyof typeof impactCategories;
import { ReactNode } from "react";

// Define the Question type with component as a ReactNode
type Question = {
  label: string;
  hint?: string | ReactElement;
  component: FunctionComponent;
};
type ImpactCategoryQuestions = {
  [key: string]: {
    questions: Question[];
  };
};

export const impactCategoryQuestions: ImpactCategoryQuestions = {
  INFRASTRUCTURE: {
    questions: [
      {
        label: "Please include your oso_name.",
        hint: (
          <span>
            You can find instructions on obtaining an oso_name{" "}
            <a href="#" target="_blank" className="text-underline">
              here
            </a>
            .
          </span>
        ),
        component: Input,
      },
      {
        label:
          "Name the top 5 high-impact projects dependent on your library/repository.",
        hint: "Include the names and brief descriptions of each project.",
        component: Textarea,
      },
      {
        label:
          "What is the percentage of Filecoin users (or percentage of the network) that run on your implementation?",
        hint: "Provide an estimated percentage if exact figures are not available.",
        component: Input,
      },
      {
        label:
          "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions does your library support? [If possible, provide a numerical estimate]",
        hint: "You may use historical data to estimate your project's impact.",
        component: Textarea,
      },
      {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "This is an open field for any extra information you'd like to share.",
        component: Textarea,
      },
    ],
  },
  TOOLING: {
    questions: [
      {
        label:
          "Please include your oso_name, if you don’t have one please follow this process [link] to get it.",
        hint: "You can find instructions on obtaining an oso_name in the documentation.",
        component: Input,
      },
      {
        label:
          "How many FVM projects are dependent on your project? Name the top 5 high-impact projects dependent on your tool.",
        hint: "Provide the names and descriptions of the top 5 projects.",
        component: Textarea,
      },
      {
        label:
          "How many times has an SDK or package developed by your project been downloaded?",
        hint: "Use package statistics from npm, PyPI, etc.",
        component: Input,
      },
      {
        label:
          "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions has it supported? [If possible, provide a numerical estimate]",
        hint: "Provide a numerical estimate if possible.",
        component: Textarea,
      },
      {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "This is an open field for any extra information you'd like to share.",
        component: Textarea,
      },
    ],
  },
  COMMUNITY_EDUCATION: {
    questions: [
      {
        label:
          "What is the increase in the number of first-time Filecoin addresses as a result of your educational content?",
        hint: "Provide an estimated percentage if exact numbers are unavailable.",
        component: Input,
      },
      {
        label:
          "What is the total number of impressions your content has received? What is the feedback score you have received?",
        hint: "Provide metrics from analytics tools, if available.",
        component: Textarea,
      },
      {
        label:
          "What is the number of people graduating from your program / What is the number of people who attended your event?",
        hint: "Include data on participation and completion rates.",
        component: Input,
      },
      {
        label:
          "What is the increase in the number of active developer users as a result of your educational content?",
        hint: "This could include new developer sign-ups or engagements.",
        component: Input,
      },
      {
        label:
          "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions has it enabled. [If possible, provide a numerical estimate and a link]",
        hint: "If possible, provide detailed economic metrics.",
        component: Textarea,
      },
      {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "This is an open field for any extra information you'd like to share.",
        component: Textarea,
      },
    ],
  },
  RESEARCH_AND_DEVELOPMENT: {
    questions: [
      {
        label:
          "What is the number of projects that are dependent on the core Filecoin Protocol Code/Mechanisms that your project has built?",
        hint: "List the names and details of the projects if known.",
        component: Textarea,
      },
      {
        label:
          "How has your research improved usability or infrastructure, for example, the response to a public Filecoin Mainnet RPC call?",
        hint: "Provide specific technical improvements.",
        component: Textarea,
      },
      {
        label:
          "What is the increase in efficiency for storage data as a result of your work? For example, a reduction in sealing costs.",
        hint: "Provide numerical data if possible.",
        component: Input,
      },
      {
        label:
          "How much improvement in system performance has Filecoin seen as a result of your work?",
        hint: "Include metrics or benchmarks if available.",
        component: Textarea,
      },
      {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "This is an open field for any extra information you'd like to share.",
        component: Textarea,
      },
    ],
  },
  GOVERNANCE: {
    questions: [
      {
        label:
          "How has your project made governance more accessible to more members of the Filecoin ecosystem?",
        hint: "Provide examples or specific outcomes.",
        component: Textarea,
      },
      {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "This is an open field for any extra information you'd like to share.",
        component: Textarea,
      },
    ],
  },
  END_USER_EXPERIENCE: {
    questions: [
      {
        label: "Please share 1-3 user case studies.",
        hint: "Provide detailed examples of user interactions.",
        component: Textarea,
      },
      {
        label:
          "What is the increase in Filecoin wallet interactions during the impact window as a result of your project?",
        hint: "Provide specific metrics if available.",
        component: Input,
      },
      {
        label:
          "What is the average number of users retained upon interacting with your application for the first time?",
        hint: "Include user retention statistics.",
        component: Input,
      },
      {
        label:
          "What is the number of returning unique transacting addresses per project?",
        hint: "List unique addresses and their frequency.",
        component: Input,
      },
      {
        label:
          "What is the increase in interactions with a project derived from this contribution?",
        hint: "Include details on how interactions have changed.",
        component: Textarea,
      },
      {
        label:
          "What is the growth in the number of monthly active addresses interacting with your project?",
        hint: "Provide numerical growth data.",
        component: Input,
      },
      {
        label:
          "What is the number of new addresses that have been funded as a result of a contribution?",
        hint: "List and quantify new funded addresses.",
        component: Input,
      },
      {
        label:
          "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions has it supported? [If possible, provide a numerical estimate]",
        hint: "If possible, include a numerical estimate.",
        component: Textarea,
      },
      {
        label:
          "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
        hint: "This is an open field for any extra information you'd like to share.",
        component: Textarea,
      },
    ],
  },
};

export function ImpactQuestions({
  selectedCategories,
}: {
  selectedCategories: string[];
}) {
  console.log("IMPACTQUESTIONS", selectedCategories);
  return (
    <div className="mt-2 space-y-2">
      {selectedCategories.map((categoryKey) => (
        <CategoryQuestions key={categoryKey} categoryKey={categoryKey} />
      ))}
    </div>
  );
}

function CategoryQuestions({
  categoryKey,
}: {
  categoryKey: ImpactCategoryKeys;
}) {
  const { control, watch } = useFormContext();
  const [hide, setHide] = useState(true);
  const { questions } = impactCategoryQuestions[categoryKey] ?? {};
  if (!questions) return null;

  console.log(JSON.stringify(watch(`application.categoryQuestions`), null, 2));
  return (
    <div className="border-1 rounded border border-gray-400">
      <div>
        <>
          <div
            onClick={() => setHide(!hide)}
            className="flex cursor-pointer flex-wrap items-center justify-between gap-3 rounded hover:bg-gray-100"
          >
            <div className="px-2">{`Category Specific Questions for ${categoryKey}`}</div>
            <div className="flex cursor-pointer items-center rounded">
              {hide ? (
                <Button variant="ghost" icon={ChevronDown} />
              ) : (
                <Button variant="ghost" icon={ChevronUp} />
              )}
            </div>
          </div>
        </>

        {!hide && (
          <div className="p-2">
            {questions.map(({ label, hint, component }, index) => {
              const fieldName = `application.categoryQuestions.${categoryKey}.${index}`;

              return (
                <FormControl
                  key={fieldName}
                  name={fieldName}
                  label={label}
                  hint={hint}
                >
                  {createElement(component)}
                </FormControl>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
