import "dotenv/config";
import "@testing-library/jest-dom";

import { afterAll, beforeAll, vi } from "vitest";

import "./test-msw";

import { server } from "./test-msw";
import { config } from "./config";

beforeAll(() => {
  // server.listen({ onUnhandledRequest: "warn" });
  /* eslint-disable-next-line */
  vi.mock("next/router", () => require("next-router-mock"));
});
afterAll(() => server.close());

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    /* eslint-disable-next-line */
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
