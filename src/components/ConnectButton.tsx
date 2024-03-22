import Image from "next/image";
import Link from "next/link";
import { type PropsWithChildren, type ComponentPropsWithRef } from "react";
import { type Address, useEnsAvatar, useEnsName } from "wagmi";
import { FaListCheck } from "react-icons/fa6";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { createBreakpoint } from "react-use";

import { Button } from "./ui/Button";
import { Chip } from "./ui/Chip";
import { useBallot } from "~/features/ballot/hooks/useBallot";
import { EligibilityDialog } from "./EligibilityDialog";
import { useLayoutOptions } from "~/layouts/BaseLayout";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 350 });

export const ConnectButton = ({ children }: PropsWithChildren) => {
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
                return <Button onClick={openChainModal}>Change network</Button>;
                return <Chip onClick={openChainModal}>Wrong network</Chip>;
              }

              return (
                children ?? (
                  <ConnectedDetails
                    account={account}
                    openAccountModal={openAccountModal}
                    isMobile={isMobile}
                  />
                )
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
  const domain = useCurrentDomain();
  const { eligibilityCheck, showBallot } = useLayoutOptions();
  return (
    <div>
      <div className="flex gap-2">
        {!showBallot ? null : ballot?.publishedAt ? (
          <Chip>Already submitted</Chip>
        ) : (
          <Chip className="gap-2" as={Link} href={`/${domain}/ballot`}>
            {isMobile ? <FaListCheck className="h-4 w-4" /> : `View Ballot`}
            <div className="flex size-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
              {ballotSize}
            </div>
          </Chip>
        )}
        <UserInfo
          onClick={openAccountModal}
          address={account.address as Address}
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
  const ens = useEnsName({ address, chainId: 1, enabled: Boolean(address) });
  const name = ens.data;
  const avatar = useEnsAvatar({ name, chainId: 1, enabled: Boolean(name) });

  return (
    <Chip className="gap-2" {...props}>
      <div className="h-6 w-6 overflow-hidden rounded-full">
        {avatar.data ? (
          <Image width={24} height={24} alt={name!} src={avatar.data} />
        ) : (
          <div className="h-full bg-gray-700" />
        )}
      </div>
      {children}
    </Chip>
  );
};
