import Image from "next/image";
import Link from "next/link";
import { type ComponentPropsWithRef, useCallback } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { FaListCheck } from "react-icons/fa6";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { createBreakpoint } from "react-use";
import { toast } from "sonner";

import { Button } from "./ui/Button";
import { Chip } from "./ui/Chip";
import { useBallot } from "~/features/ballot/hooks/useBallot";
import { useLayoutOptions } from "~/layouts/BaseLayout";
import { useMaci } from "~/contexts/Maci";
import type { Address } from "viem";
import { config } from "~/config";

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

              if (
                chain.unsupported ??
                ![Number(config.network.id)].includes(chain.id)
              ) {
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
  const { isLoading, isRegistered, isEligibleToVote, onSignup } = useMaci();

  const { showBallot } = useLayoutOptions();

  const onError = useCallback(() => toast.error("Signup error"), []);
  const handleSignup = useCallback(() => onSignup(onError), [onSignup, onError]);

  return (
    <div>
      <div className="flex gap-2 text-white">
        {!isEligibleToVote && <Chip>You are not allowed to vote</Chip>}

        {isEligibleToVote && !isRegistered && (
          <SignupButton
            loading={isRegistered === undefined || isLoading}
            onClick={handleSignup}
          />
        )}
        {isRegistered && showBallot && ballot?.publishedAt && (
          <Chip>Already submitted</Chip>
        )}
        {isRegistered && showBallot && !ballot?.publishedAt && (
          <Chip className="gap-2" as={Link} href={"/ballot"}>
            {isMobile ? <FaListCheck className="h-4 w-4" /> : `View Ballot`}
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs">
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
      </div>
    </div>
  );
};

const UserInfo = ({
  address,
  children,
  ...props
}: { address: Address } & ComponentPropsWithRef<typeof Chip>) => {
  const ens = useEnsName({
    address,
    chainId: 1,
    query: { enabled: Boolean(address) },
  });
  const name = ens.data ?? undefined;
  const avatar = useEnsAvatar({
    name,
    chainId: 1,
    query: { enabled: Boolean(name) },
  });

  return (
    <Chip className="gap-2" {...props}>
      <div className="h-6 w-6 overflow-hidden rounded-full">
        {avatar.data ? (
          <Image width={24} height={24} alt={name!} src={avatar.data} />
        ) : (
          <div className="h-full bg-gray-200" />
        )}
      </div>
      {children}
    </Chip>
  );
};

const SignupButton = ({
  loading,
  ...props
}: ComponentPropsWithRef<typeof Chip> & { loading: boolean }): JSX.Element => {
  return (
    <Chip className="gap-2" disabled={loading} {...props}>
      {loading ? "Loading..." : "Sign up"}
    </Chip>
  );
};
