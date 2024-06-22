import { config } from "~/config";

import { createCachedFetch } from "./fetch";

const fetch = createCachedFetch({ ttl: 1000 * 60 * 10 });

export interface Poll {
  pollId: string;
  createdAt: string;
  duration: string;
}

export interface GraphQLResponse {
  data?: {
    poll: Poll;
  };
}

const PollQuery = `
  query Poll {
    polls(where:{pollId: $pollId}) {
      pollId
      duration
      createdAt
    }
  }
`;

export async function fetchPoll(pollId: string) {
  return fetch<{ poll: Poll }>(config.maciSubgraphUrl, {
    method: "POST",
    body: JSON.stringify({
      query: PollQuery.replace(
        "pollId: $pollId",
        `pollId: "${pollId}"`,
      ),
    }),
  }).then((response: GraphQLResponse) => response.data?.poll);
}
