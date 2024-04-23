import Image from "next/image";
import Link from "next/link";
import { type ComponentPropsWithRef } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { getAddress, type Address } from "viem";
import { normalize } from "viem/ens";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { createBreakpoint } from "react-use";
import { ListChecks } from "lucide-react";

import { Button } from "./ui/Button";
import { Chip } from "./ui/Chip";
import { useBallot } from "~/features/ballot/hooks/useBallot";
import { EligibilityDialog } from "./EligibilityDialog";
import { useLayoutOptions } from "~/layouts/BaseLayout";

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 350 });

export const ConnectButton = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "S";

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
        authenticationStatus,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    suppressHydrationWarning
                    onClick={openConnectModal}
                    className="rounded-full"
                    variant="primary"
                  >
                    {isMobile ? "Connect" : "Connect wallet"}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return <Chip onClick={openChainModal}>Wrong network</Chip>;
              }

              return (
                <ConnectedDetails
                  account={account}
                  openAccountModal={openAccountModal}
                  isMobile={isMobile}
                />
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

const ConnectedDetails = ({
  openAccountModal,
  account,
  isMobile,
}: {
  account: { address: string; displayName: string };
  openAccountModal: () => void;
  isMobile: boolean;
}) => {
  const { data: ballot } = useBallot();
  const ballotSize = (ballot?.votes ?? []).length;

  const { eligibilityCheck, showBallot } = useLayoutOptions();
  return (
    <div>
      <div className="flex gap-2 text-white">
        {!showBallot ? null : ballot?.publishedAt ? (
          <Chip>Already submitted</Chip>
        ) : (
          <Chip className="gap-2" as={Link} href={"/ballot"}>
            {isMobile ? <ListChecks className="size-4" /> : `View Ballot`}
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surfaceContainerLow-dark text-xs">
              {ballotSize}
            </div>
          </Chip>
        )}
        <UserInfo
          onClick={openAccountModal}
          address={getAddress(account.address)}
        >
          {isMobile ? null : account.displayName}
        </UserInfo>
        {eligibilityCheck && <EligibilityDialog />}
      </div>
    </div>
  );
};

const UserInfo = ({
  address,
  children,
  ...props
}: { address: Address } & ComponentPropsWithRef<typeof Chip>) => {
  const ens = useEnsName({ address, chainId: 1 });
  const name = ens.data ? normalize(ens.data) : "";
  const avatar = useEnsAvatar({ name, chainId: 1 });

  return (
    <Chip className="gap-2" {...props}>
      <div className="h-6 w-6 overflow-hidden rounded-full">
        {avatar.data ? (
          <Image width={24} height={24} alt={name} src={avatar.data} />
        ) : (
          <div className="h-full bg-gray-200" />
        )}
      </div>
      {children}
    </Chip>
  );
};
