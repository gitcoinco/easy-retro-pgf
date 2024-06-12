import { config } from "~/config";

import { createCachedFetch } from "./fetch";

const fetch = createCachedFetch({ ttl: 1000 * 60 * 10 });

export interface User {
  id: string;
  timestamp: string;
  blockNumber: string;
  txHash: string;
  accounts: Account[];
}

export interface Account {
  id: string;
  voiceCreditBalance: string;
  timestamp: string;
  blockNumber: string;
  txHash: string;
  owner: User;
}

export interface GraphQLResponse {
  data?: {
    user: User;
  };
}

const UserQuery = `
  query User {
    user(id: $id) {
      id
      accounts {
        id
        voiceCreditBalance
      }
    }
  }
`;

export async function fetchUser(publicKey: [bigint, bigint]) {
  return fetch<{ user: User }>(config.maciSubgraphUrl, {
    method: "POST",
    body: JSON.stringify({
      query: UserQuery.replace(
        "id: $id",
        `id: "${publicKey[0]} ${publicKey[1]}"`,
      ),
    }),
  }).then((response: GraphQLResponse) => response.data?.user);
}
