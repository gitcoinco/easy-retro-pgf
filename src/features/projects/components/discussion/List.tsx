import React, { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { ThumbsDown } from "lucide-react";
import { Textarea } from "~/components/ui/Form";
import { Button } from "~/components/ui/Button";
import { Switch } from "~/components/ui/Switch";
import { ReplySvg } from "~/components/ui/ReplySvg";
import type {
  ReplyType,
  DiscussionType,
} from "~/features/projects/types/discussion";

const Item = (data: {
  user: { profile?: string; name: string };
  desc: string;
  time: string;
  impression: { like: number; unlike: number };
  type?: DiscussionType;
  replayed?: boolean;
  setHideReplayed?: () => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-14 text-sm">
      <div className="flex items-center">
        {data.replayed && <ReplySvg className="mr-5" />}

        <div className="mr-2 h-20 w-20 rounded-full bg-gray-200" />
        <div className="flex flex-col items-baseline font-medium text-onSurface-dark">
          <p className="mb-1 text-base">{data.user.name}</p>
          <span className=" text-onSurfaceVariant-dark">{data.time}</span>
          <span className="mt-5 rounded-lg border border-outline-dark px-4 py-[0.375rem]">
            {data.type}
          </span>
        </div>
      </div>
      <div
        className={`flex flex-col  ${data.replayed ? "max-w-[65%]" : "max-w-[72%]"} items-baseline gap-3`}
      >
        <p className="font-normal text-onSurfaceVariant-dark">{data.desc}</p>
        <div className="flex items-center gap-10 p-2">
          <span className="flex items-center gap-1">
            <ThumbsUp color="#006D3D" strokeWidth={1.5} />
            {data.impression.like}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown color="#934b1d" strokeWidth={1.5} />
            {data.impression.unlike}
          </span>
          {!data.replayed && (
            <button
              onClick={() => {
                if (data?.setHideReplayed) data?.setHideReplayed();
              }}
              className="px-3 py-[0.625rem] text-sm font-semibold text-primary-dark"
            >
              Hide replies
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Reply = () => {
  const [reply, setReply] = useState<ReplyType>({
    content: "",
    discussionId: "",
    isAnonymous: false,
    projectId: "",
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
      <div className="flex items-center gap-14">
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
          disabled={reply.content.length === 0}
          variant="outline"
        >
          Post idea
        </Button>
      </div>
    </div>
  );
};

export const List = () => {
  const [hideReplayed, setHideReplayed] = useState(false);
  return (
    <div className="flex w-full flex-col rounded-xl border border-outlineVariant-dark p-5">
      <Item
        user={{ name: "Chimlusoo SOSO" }}
        time="11:17 PM Sep 5, 2023 +0430"
        desc="A concern worth addressing is the potential competition or integration of similar features by existing platforms like GitHub and Discord, as mentioned in the proposal. While the likelihood of these platforms shifting their focus significantly may be low, it's essential to have a solid strategy in place to differentiate and ensure its value proposition remains compelling. Additionally, the proposal briefly touches on data accuracy and the role of moderators but could provide more details on how it plans to maintain data quality and integrity in the long term."
        impression={{ like: 12, unlike: 4 }}
        // type="Concern"
        setHideReplayed={() => setHideReplayed(!hideReplayed)}
      />
      <div className="mx-10 mt-8 flex flex-col gap-3">
        <Reply />
        {!hideReplayed && (
          <>
            <Item
              user={{ name: "Chimlusoo SOSO" }}
              time="11:17 PM Sep 5, 2023 +0430"
              desc="A concern worth addressing is the potential competition or integration of similar features by existing platforms like GitHub and Discord, as mentioned in the proposal. While the likelihood of these platforms shifting their focus significantly may be low, it's essential to have a solid strategy in place to differentiate and ensure its value proposition remains compelling. Additionally, the proposal briefly touches on data accuracy and the role of moderators but could provide more details on how it plans to maintain data quality and integrity in the long term."
              impression={{ like: 12, unlike: 4 }}
              // type="Concern"
              replayed
            />
            <Item
              user={{ name: "Chimlusoo SOSO" }}
              time="11:17 PM Sep 5, 2023 +0430"
              desc="A concern worth addressing is the potential competition or integration of similar features by existing platforms like GitHub and Discord, as mentioned in the proposal. While the likelihood of these platforms shifting their focus significantly may be low, it's essential to have a solid strategy in place to differentiate and ensure its value proposition remains compelling. Additionally, the proposal briefly touches on data accuracy and the role of moderators but could provide more details on how it plans to maintain data quality and integrity in the long term."
              impression={{ like: 12, unlike: 4 }}
              // type="Concern"
              replayed
            />
          </>
        )}
      </div>
    </div>
  );
};
