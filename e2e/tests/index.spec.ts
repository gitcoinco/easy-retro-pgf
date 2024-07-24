import { expect, test } from "@playwright/test";
import { privateKeyToAccount } from "viem/accounts";
import { db } from "~/server/db";

const account = privateKeyToAccount(
  process.env.NEXT_PUBLIC_TEST_WALLET_PRIVATE_KEY as `0x${string}`,
);

test.beforeEach(async ({ page }) => {
  try {
    await db.ballot.delete({ where: { voterId: account.address } });
  } catch (error) {}
  await page.goto("http://localhost:3000/projects");
});

test.afterEach(async () => {
  try {
    await db.ballot.delete({ where: { voterId: account.address } });
  } catch (error) {}
});

test("Submit Ballot flow", async ({ page }) => {
  // Make sure page has loaded
  await expect(
    page.locator("a").filter({ hasText: "Alpha InsidersBringing you" }),
  ).toBeVisible();

  // Connect wallet
  await page.waitForSelector(`[data-testid="connect-wallet"]`);
  await page.getByTestId("connect-wallet").click();
  await page.getByTestId("rk-auth-message-button").click();

  await expect(page.getByRole("button", { name: "0x39…dBEC" })).toBeVisible();

  await page.waitForTimeout(500);
  // Select 2 projects to add to ballot
  await page
    .locator("a")
    .filter({ hasText: "Alpha InsidersBringing you" })
    .getByRole("button")
    .click();
  await page
    .locator("a")
    .filter({ hasText: "Bankless AcademyBankless" })
    .getByRole("button")
    .click();

  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Add 2 projects to ballot" }).click();

  await page
    .locator("a")
    .filter({ hasText: "Castle CapitalCastle Capital" })
    .click();
  await expect(page.getByText("0x516272...82308bEE0")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "https://www.castlecapital.vc/" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Castle Capital" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Add to ballot" }).click();
  await page.getByLabel("allocation-input").fill("5000");
  await page.getByLabel("allocation-input").press("Enter");

  await page.getByRole("link", { name: "View ballot", exact: true }).click();

  // Ballot page
  await page
    .getByRole("row", { name: "Alpha Insiders" })
    .getByLabel("allocation-input")
    .click();
  await page
    .getByRole("row", { name: "Alpha Insiders" })
    .getByLabel("allocation-input")
    .fill("5000");
  await page
    .getByRole("row", { name: "Alpha Insiders" })
    .getByLabel("allocation-input")
    .press("Tab");
  await page
    .getByRole("row", { name: "Bankless Academy" })
    .getByLabel("allocation-input")
    .fill("2000");
  await page
    .getByRole("row", { name: "Bankless Academy" })
    .getByLabel("allocation-input")
    .blur();

  await page.getByRole("button", { name: "Submit ballot" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Submit ballot" }).click();

  await expect(
    page.getByRole("heading", { name: "Your vote has been received 🥳" }),
  ).toBeVisible();

  /*


  - Distribute
    - Create profile
    - Create pool
    - 

  - Select projects
  - Add to ballot
  - Edit ballot
  - Submit ballot

  - Add list to ballot
  - Edit list votes

  - Create application
  - Approve application
  
  - Add voters

  */
});
