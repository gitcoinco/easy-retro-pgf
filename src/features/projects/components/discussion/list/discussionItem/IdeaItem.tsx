import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  onRefetch,
}: {
  data: Discussion | ReplyResType;
  setHideReplayed?: (value: React.SetStateAction<boolean>) => void;
  replayed?: boolean;
  hideReplayed?: boolean;
  onRefetch?: () => void;
}) => {
  const { data: session } = useSession();
  const [reaction, setReaction] = useState<{
    thumbsUp: number;
    thumbsDown: number;
    type?: "thumbsUp" | "thumbsDown";
  }>({
    thumbsUp: 0,
    thumbsDown: 0,
    type: undefined,
  });

  useEffect(() => {
    setReaction({
      thumbsUp: data?.thumbsUp,
      thumbsDown: data?.thumbsDown,
      type: data?.reactions.filter(
        (item) => item?.user?.name === session?.user.name,
      )[0]?.reaction,
    });
  }, [data, onRefetch, hideReplayed]);

  const onReact = useReact({
    onSuccess: async () => {
      if (onRefetch) onRefetch();
    },
    reactionData: {
      discussionId: data.id,
      reaction: reaction.type ?? "thumbsUp",
    },
  });
  useEffect(() => {
    if (onReact?.data) {
      setReaction({
        thumbsUp: onReact?.data?.thumbsUp,
        thumbsDown: onReact?.data?.thumbsDown,
        type:
          onReact?.data?.reactions.filter(
            (item) => item?.user?.name === session?.user.name,
          )[0]?.reaction === reaction.type
            ? reaction.type
            : undefined,
      });
    }
  }, [onReact?.data]);

  return (
    <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row md:gap-14">
      <div
        className={`flex min-w-full ${replayed ? " md:min-w-[31.87%]" : "md:min-w-[25%]"} items-center`}
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
          <div className="mr-2 flex h-20 w-20 items-center justify-center rounded-full bg-outline-dark">
            <UserRound size={40} color="#ffffff" strokeWidth={1.5} />
          </div>
        )}
        <div className="flex flex-col items-baseline font-medium text-onPrimary-light">
          <p className="mb-1 text-base">
            {data.user?.name?.replace(/(.{7}).+(.{7})/, "$1...$2")}
          </p>
          <span className=" text-onPrimary-light">
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
        <p className="break-words  font-normal text-onPrimary-light">
          {data.content}
        </p>
        <div className="flex items-center gap-10 pb-0 pt-2 md:p-2">
          {reaction.type === "thumbsUp" && onReact.isPending ? (
            <Loader className="animate-spin" color="#45464f" strokeWidth={1} />
          ) : (
            <button
              onClick={() => {
                if (session && reaction.type !== "thumbsUp")
                  setReaction({ ...reaction, type: "thumbsUp" });
                onReact.mutate();
              }}
              className="flex items-center gap-1"
            >
              <ThumbsUp
                fill={reaction?.type === "thumbsUp" ? "#00B669" : "none"}
                color="#00B669"
                strokeWidth={1.5}
              />
              {reaction?.thumbsUp}
            </button>
          )}
          {reaction.type === "thumbsDown" && onReact.isPending ? (
            <Loader className="animate-spin" color="#45464f" strokeWidth={1} />
          ) : (
            <button
              onClick={() => {
                if (session && reaction.type !== "thumbsDown")
                  setReaction({ ...reaction, type: "thumbsDown" });
                onReact.mutate();
              }}
              className="flex items-center gap-1"
            >
              <ThumbsDown
                fill={reaction?.type === "thumbsDown" ? "#FEA16C" : "none"}
                color="#FEA16C"
                strokeWidth={1.5}
              />
              {reaction?.thumbsDown}
            </button>
          )}
          {onReact.error && (
            <p className="break-words  py-1 text-xs font-normal text-error-dark">
              {onReact.error.message}
            </p>
          )}
          {data?.replies && data?.replies?.length > 0 && !replayed && (
            <button
              onClick={() => {
                if (setHideReplayed) setHideReplayed(!hideReplayed);
              }}
              className="px-3 py-[0.625rem] text-sm font-semibold text-primary-dark hover:text-onPrimary-light"
            >
              {!hideReplayed ? "Hide replies" : "Show replies"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
