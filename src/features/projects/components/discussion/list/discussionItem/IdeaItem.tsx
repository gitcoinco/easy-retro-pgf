import React, { useState } from "react";
import Image from "next/image";
import { ThumbsDown, ThumbsUp, UserRound } from "lucide-react";
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
  const [reaction, setReaction] = useState({
    like: data.thumbsUp,
    disLike: data.thumbsDown,
  });
  const onLike = useReact({
    onSuccess: async () =>
      setReaction({ ...reaction, like: reaction.like + 1 }),
    reactionData: { discussionId: data.id, reaction: "thumbsUp" },
  });
  const onDislike = useReact({
    onSuccess: async () =>
      setReaction({ ...reaction, disLike: reaction.disLike + 1 }),
    reactionData: { discussionId: data.id, reaction: "thumbsDown" },
  });
  return (
    <div className="flex items-center justify-between gap-14 text-sm">
      <div
        className={`flex ${replayed ? "min-w-[31.87%]" : "min-w-[23.87%]"} items-center`}
      >
        {replayed && <ReplySvg className="mr-5" />}
        {data.user?.image ? (
          <Image
            className="max-h-full scale-75"
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
        <p className="break-words break-all font-normal text-onSurfaceVariant-dark">{data.content}</p>
        <div className="flex items-center gap-10 p-2 pb-0">
          <button
            onClick={() => onLike.mutate()}
            className="flex items-center gap-1"
          >
            <ThumbsUp color="#006D3D" strokeWidth={1.5} />
            {reaction.like}
          </button>
          <button
            onClick={() => onDislike.mutate()}
            className="flex items-center gap-1"
          >
            <ThumbsDown color="#934b1d" strokeWidth={1.5} />
            {reaction.disLike}
          </button>
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
