import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { BrowserProvider, type Signer } from "ethers";
import type { WalletClient } from "viem";

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

  return provider.getSigner(account?.address);
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
