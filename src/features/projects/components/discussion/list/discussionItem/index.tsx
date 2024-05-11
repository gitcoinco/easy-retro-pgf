import React, { useState, useEffect } from "react";

import { Textarea } from "~/components/ui/Form";
import { Button } from "~/components/ui/Button";
import { Switch } from "~/components/ui/Switch";
import { IdeaItem } from "./IdeaItem";
import { useAddReply } from "~/features/projects/hooks/useDiscussion";
import type {
  Discussion,
  ReplyResType,
} from "~/features/projects/types/discussion";

const Reply = ({
  discussionId,
  projectId,
  onRefetch,
}: {
  discussionId: string;
  projectId: string;
  onRefetch: () => void;
}) => {
  const [reply, setReply] = useState({
    content: "",
    isAnonymous: false,
  });
  const submit = useAddReply({
    onSuccess: async () => {
      setReply({ ...reply, content: "" });
      onRefetch();
    },
    replyData: {
      content: reply.content,
      isAnonymous: reply.isAnonymous,
      projectId: projectId,
      discussionId: discussionId,
    },
  });

  return (
    <div
      className={`relative flex flex-col border ${reply.content.length === 1024 ? "border-error-dark" : "border-onPrimary-light"} px-3 py-2 md:px-4`}
    >
      <span
        className={`absolute -top-[0.625rem] flex text-xs font-normal dark:bg-background-dark ${reply.content.length === 1024 ? "text-error-dark" : "dark:text-onPrimary-light"}`}
      >
        Your reply
      </span>
      <Textarea
        className="resize-none border-none p-0"
        rows={3}
        placeholder="Type your reply here."
        onChange={(e) => setReply({ ...reply, content: e.target.value })}
        value={reply.content}
        maxLength={1024}
      />
      <div className="mt-4 flex flex-col items-baseline gap-4 md:mt-2 md:flex-row md:items-center md:gap-14">
        <div className="flex items-center justify-evenly gap-5">
          <Switch
            isOn={reply.isAnonymous}
            setIsOn={() =>
              setReply({ ...reply, isAnonymous: !reply.isAnonymous })
            }
          />
          <span className="flex text-sm font-medium text-onSurfaceVariant-dark">
            Post anonymously
          </span>
        </div>
        <Button
          className="w-fit px-6"
          disabled={
            reply.content.length === 0 ||
            submit.isPending ||
            reply.content.length === 1024
          }
          variant="outline"
          onClick={() => submit.mutate()}
        >
          Post idea
        </Button>
        {submit.error && (
          <p className="break-words break-all py-1 text-xs font-normal text-error-dark">
            {submit.error.message}
          </p>
        )}
      </div>
    </div>
  );
};
export const DiscussionItem = ({
  discussion,
  projectId,
  onRefetch,
}: {
  discussion: Discussion;
  projectId: string;
  onRefetch: () => void;
}) => {
  const [hideReplayed, setHideReplayed] = useState(false);

  return (
    <div className="flex w-full flex-col border border-outline-dark p-3 md:p-5">
      <IdeaItem
        key={discussion.id}
        data={discussion}
        setHideReplayed={setHideReplayed}
        hideReplayed={hideReplayed}
        onRefetch={() => onRefetch()}
      />

      <div className="mt-8 flex flex-col gap-6 md:mx-10 md:gap-4">
        <Reply
          discussionId={discussion.id}
          projectId={projectId}
          onRefetch={() => onRefetch()}
        />
        {!hideReplayed && discussion?.replies.length > 0 && (
          <>
            {discussion?.replies?.map((reply: ReplyResType) => (
              <IdeaItem
                key={reply.id}
                data={reply}
                setHideReplayed={setHideReplayed}
                hideReplayed={hideReplayed}
                replayed
                onRefetch={() => onRefetch()}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
