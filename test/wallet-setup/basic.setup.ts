import {
  MetaMask,
  defineWalletSetup,
  getExtensionId,
} from "@synthetixio/synpress";
import Dotenv from "dotenv";

Dotenv.config({ path: [".env", ".env.test"], override: true });

const SEED_PHRASE = process.env.TEST_SEED_PHRASE!;
const PRIVATE_KEY = process.env.TEST_PRIVATE_KEY!;
const PASSWORD = process.env.TEST_WALLET_PASSWORD!;

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, "MetaMask");

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId);

  await metamask.importWallet(SEED_PHRASE);
  await metamask.importWalletFromPrivateKey(PRIVATE_KEY);
  // await metamask.switchNetwork("optimism");
  // await metamask.confirmSignature();
});
