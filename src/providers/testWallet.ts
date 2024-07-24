import { mock } from "wagmi/connectors";

export function createTestWallet() {
  return [
    {
      groupName: "Testing",
      wallets: [
        () =>
          mock({ accounts: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"] }),
      ],
    },
  ];
}
