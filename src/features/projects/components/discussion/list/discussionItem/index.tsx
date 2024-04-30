import React, { useState } from "react";

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
    <div className="relative flex flex-col rounded border border-outline-dark px-4 py-2">
      <span className="absolute -top-[0.625rem] flex text-xs font-normal dark:bg-background-dark dark:text-onSurfaceVariant-dark">
        Your reply
      </span>
      <Textarea
        className="resize-none border-none p-0"
        rows={3}
        placeholder="Type your reply here."
        onChange={(e) => setReply({ ...reply, content: e.target.value })}
        value={reply.content}
      />
      <div className="mt-2 flex items-center gap-14">
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
          disabled={reply.content.length === 0 || submit.isPending}
          variant="outline"
          onClick={() => submit.mutate()}
        >
          Post idea
        </Button>
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
    <div className="flex w-full flex-col rounded-xl border border-outlineVariant-dark p-5">
      <IdeaItem
        key={discussion.id}
        data={discussion}
        setHideReplayed={setHideReplayed}
        hideReplayed={hideReplayed}
      />

      <div className="mx-10 mt-8 flex flex-col gap-4">
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
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
