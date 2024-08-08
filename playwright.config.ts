import { defineConfig, devices } from "@playwright/test";
import Dotenv from "dotenv";

Dotenv.config({ path: [".env", ".env.test"], override: true });

export default defineConfig({
  testDir: "test/e2e",
  timeout: 60 * 1000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "html",
  use: {
    actionTimeout: 0,
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    headless: false,
  },
  // start local web server before tests
  webServer: [
    {
      command: "npm run test:server",
      url: "http://localhost:3000",
      timeout: 60000,
      reuseExistingServer: true,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  outputDir: "test-results",
});
