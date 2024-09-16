import React from "react";
import { describe, expect, test, vi } from "vitest";
import type { Chain, WalletClient } from "wagmi";
import { MockConnector } from "wagmi/connectors/mock";

import ProjectsPage from "~/pages/[domain]/projects";
import { fireEvent, render, screen } from "~/test-utils";
import ProjectDetailsPage from "~/pages/[domain]/projects/[projectId]";

vi.mock("wagmi", async () => {
  const actual = await vi.importActual("wagmi");
  return {
    ...actual,
  };
});

vi.mock("@rainbow-me/rainbowkit", async () => {
  const actual = await vi.importActual("@rainbow-me/rainbowkit");
  return {
    ...actual,
    connectorsForWallets: () => undefined,
    getWalletConnectConnector: (opts: {
      chains: Chain[];
      options: { chainId: number; walletClient: WalletClient };
    }) => ({
      id: "mock",
      name: "Mock Wallet",
      iconUrl: "",
      iconBackground: "#fff",
      hidden: ({}) => false,
      createConnector: () => ({ connector: new MockConnector(opts) }),
    }),
  };
});

describe.skip("EasyRetroPGF", () => {
  test("browse projects", async () => {
    render(<ProjectsPage />);

    const project = await screen.findByText(/Project #1/);

    expect(project).toBeInTheDocument();
  });
  test("add project to ballot", async () => {
    render(<ProjectDetailsPage projectId={"project-1"} />);

    const project = await screen.findByText(/Project #1/);

    const button = await screen.findByText("Add to ballot");

    fireEvent.click(button);

    const input = await screen.findByLabelText("allocation-input");
    fireEvent.change(input, { target: { value: "10" } });

    fireEvent.click(await screen.findByText(/Add votes/));

    expect(project).toBeInTheDocument();
  });
  test.skip("browse lists", async () => {
    //
  });
  test.skip("add list to ballot", async () => {
    //
  });
  test.skip("view ballot", async () => {
    //
  });
  test.skip("edit ballot", async () => {
    //
  });
  test.skip("publish ballot", async () => {
    //
  });
});
