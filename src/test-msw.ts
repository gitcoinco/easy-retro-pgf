import "@testing-library/jest-dom";

import superjson from "superjson";
import { createTRPCMsw } from "msw-trpc";
import { type AppRouter } from "./server/api/root";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";

export const mockTrpc = createTRPCMsw<AppRouter>({
  baseUrl: "http://localhost:3000/api/trpc",
  transformer: {
    input: superjson,
    output: superjson,
  },
});

const mockProjects = Array(24)
  .fill(null)
  .map((_, i) => ({
    id: `project-${i}`,
    name: `Project #${i}`,
    metadataPtr: "https://localhost:3000/api/metadata",
  }));
export const server = setupServer(
  http.get("/api/auth/session", () => {
    return HttpResponse.json({});
  }),
  // mockTrpc.projects.search.query(() => {
  //   return mockProjects;
  // }),
  // mockTrpc.projects.get.query(({ id }) => {
  //   return mockProjects.find((p) => p.id === id);
  // }),
  // mockTrpc.metadata.get.query((params) => {
  //   console.log(params);
  //   return {};
  // }),
  // mockTrpc.projects.count.query(() => {
  //   return { count: 9999 };
  // }),
);
