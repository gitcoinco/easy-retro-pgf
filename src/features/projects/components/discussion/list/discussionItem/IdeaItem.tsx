import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ThumbsDown, ThumbsUp, UserRound, Loader } from "lucide-react";
import { formatDate } from "~/utils/time";
import { ReplySvg } from "~/components/ui/ReplySvg";
import { useReact } from "~/features/projects/hooks/useDiscussion";

import type {
  Discussion,
  ReplyResType,
} from "~/features/projects/types/discussion";

export const IdeaItem = ({
  data,
  setHideReplayed,
  hideReplayed,
  replayed = false,
}: {
  data: Discussion | ReplyResType;
  setHideReplayed?: (value: React.SetStateAction<boolean>) => void;
  replayed?: boolean;
  hideReplayed?: boolean;
}) => {
  const [reactionType, setReactionType] = useState<
    "thumbsUp" | "thumbsDown" | undefined
  >(data?.reactions[0]?.reaction);
  const [reaction, setReaction] = useState<{
    thumbsUp: number;
    thumbsDown: number;
    type?: "thumbsUp" | "thumbsDown";
  }>({
    thumbsUp: data?.thumbsUp,
    thumbsDown: data?.thumbsDown,
    type: undefined,
  });

  console.log("data?.reactions[0]", data);

  const onReact = useReact({
    onSuccess: async () => console.log("2443"),
    reactionData: {
      discussionId: data.id,
      reaction: reactionType ?? "thumbsUp",
    },
  });
  useEffect(() => {
    if (onReact?.data) {
      setReaction({
        thumbsUp: onReact?.data?.thumbsUp as number,
        thumbsDown: onReact?.data?.thumbsDown as number,
        type: reactionType,
      });
      setReactionType(undefined);
    }
  }, [onReact?.data]);

  return (
    <div className="flex items-center justify-between gap-14 text-sm">
      <div
        className={`flex ${replayed ? "min-w-[31.87%]" : "min-w-[25%]"} items-center`}
      >
        {replayed && <ReplySvg className="mr-5" />}
        {data.user?.image ? (
          <img
            className="mr-2 flex h-20 w-20 items-center justify-center rounded-full "
            width={80}
            height={80}
            alt="user image"
            src={data.user?.image}
          />
        ) : (
          <div className="mr-2 flex h-20 w-20 items-center justify-center rounded-full bg-surfaceContainerHigh-dark">
            <UserRound size={40} color="#8f909a" strokeWidth={1.5} />
          </div>
        )}
        <div className="flex flex-col items-baseline font-medium text-onSurface-dark">
          <p className="mb-1 text-base">
            {data.user?.name?.replace(/(.{7}).+(.{7})/, "$1...$2")}
          </p>
          <span className=" text-onSurfaceVariant-dark">
            {formatDate(data.createdAt)}
          </span>

          {!replayed && (
            <span className="mt-5 rounded-lg border border-outline-dark px-4 py-[0.375rem]">
              {data.type}
            </span>
          )}
        </div>
      </div>
      <div
        className={` flex w-full flex-col items-baseline justify-between gap-3`}
      >
        <p className="break-words break-all font-normal text-onSurfaceVariant-dark">
          {data.content}
        </p>
        <div className="flex items-center gap-10 p-2 pb-0">
          {reactionType === "thumbsUp" && onReact.isPending ? (
            <Loader className="animate-spin" color="#45464f" strokeWidth={1} />
          ) : (
            <button
              onClick={() => {
                if (reactionType === "thumbsUp") setReactionType(undefined);
                else setReactionType("thumbsUp");
                onReact.mutate();
              }}
              className="flex items-center gap-1"
            >
              <ThumbsUp
                fill={reaction?.type === "thumbsUp" ? "#006D3D" : "none"}
                color="#006D3D"
                strokeWidth={1.5}
              />
              {reaction?.thumbsUp}
            </button>
          )}
          {reactionType === "thumbsDown" && onReact.isPending ? (
            <Loader className="animate-spin" color="#45464f" strokeWidth={1} />
          ) : (
            <button
              onClick={() => {
                if (reactionType === "thumbsDown") setReactionType(undefined);
                else setReactionType("thumbsDown");
                onReact.mutate();
              }}
              className="flex items-center gap-1"
            >
              <ThumbsDown
                fill={reaction?.type === "thumbsDown" ? "#934b1d" : "none"}
                color="#934b1d"
                strokeWidth={1.5}
              />
              {reaction?.thumbsDown}
            </button>
          )}
          {onReact.error && (
            <p className="break-words break-all py-1 text-xs font-normal text-error-dark">
              {onReact.error.message}
            </p>
          )}
          {data?.replies && data?.replies?.length > 0 && !replayed && (
            <button
              onClick={() => {
                if (setHideReplayed) setHideReplayed(!hideReplayed);
              }}
              className="px-3 py-[0.625rem] text-sm font-semibold text-primary-dark"
            >
              {!hideReplayed ? "Hide replies" : "Show replies"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
