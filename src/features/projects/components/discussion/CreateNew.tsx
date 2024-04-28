import React, { useState } from "react";

import { useCreateDiscussion } from "~/features/projects/hooks/useDiscussion";

import { Textarea } from "~/components/ui/Form";
import { Button } from "~/components/ui/Button";
import { Switch } from "~/components/ui/Switch";

import { type IdeaType, type Idea } from "./index";

export const CreateNew = () => {
  const ideaType: IdeaType[] = ["Concern", "Question", "Strength"];
  const [idea, setIdea] = useState<Idea>({
    desc: "",
    type: "Concern",
    isAnonymous: false,
  });
  const submit = useCreateDiscussion({
    onSuccess: async () => void console.log("add successfully"),
  });

  return (
    <div className="relative flex w-full flex-col rounded border border-outline-dark px-4 py-2">
      <span className="absolute -top-[0.625rem] flex text-xs font-normal dark:bg-background-dark dark:text-onSurfaceVariant-dark">
        Your idea
      </span>
      <div className="flex items-center justify-between">
        <ul className="flex w-full items-center justify-around border-b border-surfaceContainerHigh-dark">
          {ideaType.map((item: IdeaType) => (
            <li
              className={` text-sm font-medium text-onSurfaceVariant-dark hover:bg-onSurface-dark/[0.08]  ${idea.type.toLowerCase() === item.toLowerCase() ? " border-b-[3px] border-primary-dark  text-primary-dark hover:bg-onSurface-dark/[0.12]" : ""}`}
            >
              <button
                onClick={() =>
                  setIdea({
                    ...idea,
                    type: item.toLowerCase() as IdeaType,
                  })
                }
                className="p-3"
              >
                {`${item + "s"}`}
              </button>
            </li>
          ))}
        </ul>
        <div className="ml-11 flex min-w-52 items-center justify-evenly gap-5">
          <Switch
            isOn={idea.isAnonymous}
            setIsOn={() => setIdea({ ...idea, isAnonymous: !idea.isAnonymous })}
          />
          <span className="flex text-sm font-medium text-onSurfaceVariant-dark">
            Post anonymously
          </span>
        </div>
      </div>
      <Textarea
        className="mt-5 resize-none border-none p-0"
        rows={3}
        placeholder={`Type your ${idea.type.toLowerCase()} here.`}
        onChange={(e) => setIdea({ ...idea, desc: e.target.value })}
        value={idea.desc}
      />
      <Button
        className="my-2 w-fit px-6"
        disabled={idea.desc.length === 0}
        variant="outline"
        onClick={() => submit.mutate()}
      >
        Post idea
      </Button>
    </div>
  );
};
