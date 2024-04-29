import { useMutation } from "@tanstack/react-query";

import type {
  DiscussionData,
  ListType,
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
export function useGetDiscussions(projectId: ListType) {
  return api.discussion.get.useQuery(projectId);
}
