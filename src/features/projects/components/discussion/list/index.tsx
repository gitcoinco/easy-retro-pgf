import React from "react";
import type { Discussion } from "~/features/projects/types/discussion";
import { DiscussionItem } from "./discussionItem";

export const List = ({
  discussions,
  projectId,
  onRefetch,
}: {
  discussions: Discussion[];
  projectId: string;
  onRefetch: () => void;
}) => {
  return (
    <>
      {discussions?.map((discussion: Discussion) => {
        return (
          <DiscussionItem
            discussion={discussion}
            projectId={projectId}
            onRefetch={() => onRefetch()}
          />
        );
      })}
    </>
  );
};
