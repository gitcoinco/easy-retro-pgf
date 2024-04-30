import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const ALCHEMY_ETH_MAINNET_API_KEY = process.env.ALCHEMY_ETH_MAINNET_API_KEY;

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_ETH_MAINNET_API_KEY}`,
  ),
});
