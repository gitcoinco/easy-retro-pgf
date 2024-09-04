"use client";

import type { ReactNode, PropsWithChildren } from "react";
import Header from "~/components/Header";
import { BaseLayout, type LayoutProps } from "./BaseLayout";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import { Spinner } from "~/components/ui/Spinner";
import { useAccount } from "wagmi";
import { HandIcon, PauseIcon, WalletIcon } from "lucide-react";
import { Alert } from "~/components/ui/Alert";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;

export const MetricsLayout = ({
  children,
  sidebarComponent,
  ...props
}: Props) => {
  const domain = useCurrentDomain();
  const { isAdmin, isVoter, isPending } = useCurrentUser();
  const roundState = useRoundState();
  const { address } = useAccount();

  const isVotingPhase = roundState === "VOTING";

  const navLinks = [
    {
      href: `/${domain}`,
      children: `Round`,
    },
  ];

  if (isVoter && isVotingPhase) {
    navLinks.push({
      // Adding conditional metrics as well because we don't have yet anything to show in the metric (description, calculation, etc)
      href: `/${domain}/metrics`,
      children: `Voting`,
    });
    navLinks.push({
      href: `/${domain}/ballot/metrics`,
      children: `Ballot`,
    });
  }

  if (isAdmin) {
    navLinks.push(
      ...[
        {
          href: `/${domain}/admin`,
          children: `Admin`,
        },
      ],
    );

    if (["TALLYING" || "RESULTS"].includes(roundState!)) {
      navLinks.push(
        ...[
          {
            href: `/${domain}/admin/distribute`,
            children: `Distribute`,
          },
        ],
      );
    }
  }

  return (
    <BaseLayout
      sidebar={isVoter && isVotingPhase ? "right" : undefined}
      sidebarComponent={isVoter && isVotingPhase ? sidebarComponent : undefined}
      {...props}
      header={<Header navLinks={navLinks} />}
    >
      {isPending ? (
        <div className="flex flex-col items-center gap-2 py-12">
          <div>Loading...</div>
          <Spinner className="size-6" />
        </div>
      ) : !address ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <Alert title="Connect Your Wallet" icon={WalletIcon}>
            Please connect your wallet to verify if you are an eligible voter
          </Alert>
        </div>
      ) : !isVoter ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <Alert title="Access Restricted" icon={HandIcon}>
            Only eligible voters can access this page. Please check your eligibility.
          </Alert>
        </div>
      ) : !isVotingPhase ? (
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-4 py-12">
            <Alert title="Voting Phase Not Active" icon={PauseIcon}>
            The voting phase is currently inactive. Please check back later for updates.
            </Alert>
          </div>
        </div>
      ) : (
        children
      )}
    </BaseLayout>
  );
};
