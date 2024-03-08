import { type PublicClient, useNetwork } from "wagmi";
import { Allo, Registry } from "@allo-team/allo-v2-sdk/";

import { decodeEventLog, type Address, type Chain } from "viem";
import { useMemo } from "react";
import { type JsonFragment } from "ethers";

const createAlloOpts = (chain: Chain) => ({
  chain: chain.id,
  rpc: chain.rpcUrls.default.http[0],
});
export function useAllo() {
  const { chain } = useNetwork();
  return useMemo(() => chain && new Allo(createAlloOpts(chain)), [chain]);
}
export function useAlloRegistry() {
  const { chain } = useNetwork();
  return useMemo(() => chain && new Registry(createAlloOpts(chain)), [chain]);
}

export async function waitForLogs(
  hash: Address,
  abi: readonly JsonFragment[],
  client: PublicClient,
) {
  return client.waitForTransactionReceipt({ hash }).then(({ logs }) => {
    console.log("logs", logs);
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
