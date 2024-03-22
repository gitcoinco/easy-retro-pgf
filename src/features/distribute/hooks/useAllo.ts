import { Allo, Registry } from "@allo-team/allo-v2-sdk/";
import { useAccount } from "wagmi";

import {
  decodeEventLog,
  type Address,
  type PublicClient,
  type Chain,
} from "viem";
import { useMemo } from "react";
import { type JsonFragment } from "ethers";

const createAlloOpts = (chain: Chain) => ({
  chain: chain.id,
  rpc: chain.rpcUrls.default.http[0],
});

export function useAllo() {
  const { chain } = useAccount();

  return useMemo(() => chain && new Allo(createAlloOpts(chain)), [chain]);
}
export function useAlloRegistry() {
  const { chain } = useAccount();

  return useMemo(() => chain && new Registry(createAlloOpts(chain)), [chain]);
}

export async function waitForLogs(
  hash: Address,
  abi: readonly JsonFragment[],
  client: PublicClient,
) {
  return client.waitForTransactionReceipt({ hash }).then(({ logs }) => {
    return logs
      .map(({ data, topics }) => {
        try {
          return decodeEventLog({ abi, data, topics });
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);
  });
}
