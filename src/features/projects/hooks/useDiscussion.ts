import { useMutation } from "@tanstack/react-query";

import type {
  DiscussionData,
  ReplyReqType,
  ListReqType,
  ReactType,
} from "~/features/projects/types/discussion";

import { api } from "~/utils/api";

export function useCreateDiscussion({
  onSuccess,
  discussionData,
}: {
  onSuccess: () => Promise<void>;
  discussionData: DiscussionData;
}) {
  const { mutateAsync, isPending } = api.discussion.create.useMutation({
    onSuccess,
  });
  return useMutation({
    mutationFn: async () => {
      return mutateAsync({
        isAnonymous: discussionData.isAnonymous,
        type: discussionData.type,
        content: discussionData.content,
        projectId: discussionData.projectId,
      });
    },
  });
}
export function useGetDiscussions(projectId: ListReqType) {
  return api.discussion.get.useQuery(projectId);
}

export function useAddReply({
  onSuccess,
  replyData,
}: {
  onSuccess: () => Promise<void>;
  replyData: ReplyReqType;
}) {
  const { mutateAsync, isPending } = api.discussion.reply.useMutation({
    onSuccess,
  });
  return useMutation({
    mutationFn: async () => {
      return mutateAsync({
        isAnonymous: replyData.isAnonymous,
        content: replyData.content,
        projectId: replyData.projectId,
        discussionId: replyData.discussionId,
      });
    },
  });
}

export function useReact({
  onSuccess,
  reactionData,
}: {
  onSuccess: () => Promise<void>;
  reactionData: ReactType;
}) {
  const { mutateAsync, isPending } = api.discussion.react.useMutation({
    onSuccess,
  });
  return useMutation({
    mutationFn: async () => {
      return mutateAsync({
        discussionId: reactionData.discussionId,
        reaction: reactionData.reaction,
      });
    },
  });
}
