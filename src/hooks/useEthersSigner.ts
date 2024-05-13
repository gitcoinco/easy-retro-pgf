import { useEffect, useMemo, useState } from "react";
import { useWalletClient } from "wagmi";
import {
  BrowserProvider,
  JsonRpcSigner,
  type Signer,
  AlchemyProvider,
} from "ethers";
import type { WalletClient } from "viem";
import { config } from "~/config";

async function walletClientToSigner(
  walletClient: WalletClient,
): Promise<Signer> {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress: chain?.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account!.address);

  return signer;
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const [signer, setSigner] = useState<Signer>();
  const { data: walletClient } = useWalletClient({ chainId });

  useEffect(() => {
    if (!walletClient) {
      return;
    }

    walletClientToSigner(walletClient)
      .then((walletSigner) => {
        setSigner(walletSigner);
      })
      .catch(console.error);
  }, [walletClient?.account, walletClient?.chain?.id, setSigner]);

  return signer;
}

export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const provider = useMemo(
    () =>
      new AlchemyProvider(
        chainId ?? config.network.id,
        process.env.NEXT_PUBLIC_ALCHEMY_ID,
      ),
    [chainId],
  );

  return provider;
}
