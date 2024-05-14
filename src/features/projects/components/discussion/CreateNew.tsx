import React, { useState } from "react";

import type {
  DiscussionData,
  DiscussionTypes,
} from "~/features/projects/types/discussion";
import { useCreateDiscussion } from "~/features/projects/hooks/useDiscussion";

import { Textarea } from "~/components/ui/Form";
import { Button } from "~/components/ui/Button";
import { Switch } from "~/components/ui/Switch";

export const CreateNew = ({
  projectId,
  onRefetch,
}: {
  projectId: string;
  onRefetch: () => void;
}) => {
  const ideaType: DiscussionTypes[] = ["concern", "question", "strength"];

  const [idea, setIdea] = useState<DiscussionData>({
    content: "",
    type: "concern",
    isAnonymous: false,
    projectId: projectId,
  });

  const submit = useCreateDiscussion({
    onSuccess: async () => {
      setIdea({ ...idea, content: "" });
      onRefetch();
    },
    discussionData: idea,
  });

  return (
    <div
      className={`relative flex w-full flex-col border ${idea.content.length === 1024 ? "border-error-dark" : "border-onPrimary-light"} px-3 md:px-4 py-2`}
    >
      <span
        className={`absolute -top-[0.625rem] flex text-xs font-normal dark:bg-background-dark ${idea.content.length === 1024 ? "text-error-dark" : "dark:text-onPrimary-light"}`}
      >
        Your idea
      </span>
      <div className="flex flex-col md:flex-row items-start gap-3 md:items-center md:justify-between">
        <ul className="flex w-full items-center justify-around border-b border-outline-dark">
          {ideaType.map((item: DiscussionTypes, index) => (
            <li
              key={index}
              className={` text-sm font-medium text-onPrimary-light hover:bg-onSurface-dark/[0.08]  ${idea.type.toLowerCase() === item.toLowerCase() ? " border-b-[3px] border-primary-dark  text-primary-dark hover:bg-onSurface-dark/[0.12]" : ""}`}
            >
              <button
                onClick={() =>
                  setIdea({
                    ...idea,
                    type: item.toLowerCase() as DiscussionTypes,
                  })
                }
                className="p-3"
              >
                {`${item.charAt(0).toUpperCase() + item.slice(1) + "s"}`}
              </button>
            </li>
          ))}
        </ul>
        <div className="md:ml-11 flex min-w-52 items-center justify-evenly gap-5">
          <Switch
            isOn={idea.isAnonymous}
            setIsOn={() => setIdea({ ...idea, isAnonymous: !idea.isAnonymous })}
          />
          <span className="flex text-sm font-medium text-onPrimary-light">
            Post anonymously
          </span>
        </div>
      </div>
      <Textarea
        className="mt-3 md:mt-5 resize-none border-none p-0"
        rows={3}
        placeholder={`Type your ${idea.type.toLowerCase()} here.`}
        onChange={(e) => setIdea({ ...idea, content: e.target.value })}
        value={idea.content}
        maxLength={1024}
      />
      <Button
        className="my-2 w-fit px-6"
        disabled={
          idea.content.length === 0 ||
          submit.isPending ||
          idea.content.length === 1024
        }
        variant="outline"
        onClick={() => submit.mutate()}
      >
        Post idea
      </Button>
      {submit.error && (
        <p className="break-words  py-1 text-xs font-normal text-error-dark">
          {submit.error.message}
        </p>
      )}
    </div>
  );
};
