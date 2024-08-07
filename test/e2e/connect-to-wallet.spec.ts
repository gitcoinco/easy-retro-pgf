import { expect } from "playwright/test";

import {
  MetaMask,
  testWithSynpress,
  metaMaskFixtures,
} from "@synthetixio/synpress";

import BasicSetup from "../wallet-setup/basic.setup";

import Dotenv from "dotenv";

Dotenv.config({ path: [".env", ".env.test"], override: true });

const test = testWithSynpress(metaMaskFixtures(BasicSetup));

test("should connect wallet to the MetaMask Test Dapp", async ({
  context,
  page,
  extensionId,
}) => {
  const metamask = new MetaMask(
    context,
    page,
    BasicSetup.walletPassword,
    extensionId,
  );

  await page.goto("/");

  await page.getByTestId("connect-wallet").click();
  await page.getByTestId("rk-wallet-option-io.metamask").click();
  await metamask.connectToDapp();
  await page.getByTestId("rk-auth-message-button").click();
  await metamask.confirmSignature();
  await expect(page.getByTestId("go-to-app-button")).toBeVisible();

  const selectedAddress: string = await page.evaluate(
    () => window.ethereum.selectedAddress,
  );

  expect(selectedAddress).toBe(process.env.TEST_WALLET_ADDRESS);
});
