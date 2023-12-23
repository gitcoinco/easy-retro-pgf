import React, { type PropsWithChildren, type ReactElement } from "react";
import { type RenderOptions, render } from "@testing-library/react";

import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";
import { httpLink } from "@trpc/client";

import { type AppRouter } from "./server/api/root";

import { Providers } from "./providers";

const AllTheProviders = ({ children }: PropsWithChildren) => {
  return <Providers>{children}</Providers>;
};

const mockApi = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpLink({
          url: `http://localhost:3000/api/trpc`,
          headers: () => ({ "Content-Type": "application/json" }),
        }),
      ],
    };
  },
  ssr: false,
});

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: mockApi.withTRPC(AllTheProviders), ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
