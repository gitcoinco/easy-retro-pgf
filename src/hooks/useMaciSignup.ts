import { signup, type Signer, isRegisteredUser } from "maci-cli/sdk";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Attestation } from "~/utils/fetchAttestations";

import { config } from "~/config";
import { api } from "~/utils/api";
import { useEthersSigner } from "./useEthersSigner";
import { useAccount } from "wagmi";

export interface IUseMaciSignUpData {
  isAllowedToVote: boolean;
  stateIndex?: string;
  isRegistered?: boolean;
  onSignup: () => Promise<void>;
}

export const useMaciSignup = (): IUseMaciSignUpData => {
  const { data } = useSession();
  const signer = useEthersSigner();
  const { address, isConnected } = useAccount();

  const [isRegistered, setIsRegistered] = useState<boolean>();
  const [stateIndex, setStateIndex] = useState<string>();

  const attestations = api.voters.approvedAttestations.useQuery({
    address,
  });

  const attestationId = useMemo(() => {
    const values = attestations.data?.valueOf() as Attestation[] | undefined;
    const length = values?.length ?? 1;

    return values?.[length - 1]?.id;
  }, [attestations]);

  const isAllowedToVote = useMemo(() => Boolean(attestationId), [attestationId]);

  const onSignup = useCallback(async () => {
    if (!data?.publicKey || !signer || !attestationId) {
      return;
    }

    const { stateIndex: index, hash } = await signup({
      maciPubKey: data.publicKey,
      maciAddress: config.maciAddress!,
      sgDataArg: attestationId,
      signer: signer as unknown as Signer,
    });

    console.log(`Signup transaction hash: ${hash}`);

    if (index) {
      setIsRegistered(true);
      setStateIndex(index);
    }
  }, [
    attestationId,
    data?.publicKey,
    address,
    signer,
    setIsRegistered,
    setStateIndex,
  ]);

  useEffect(() => {
    if (!isConnected || !signer || !data?.publicKey || !address) {
      return;
    }

    isRegisteredUser({
      maciPubKey: data.publicKey,
      maciAddress: config.maciAddress!,
      signer: signer as unknown as Signer,
    })
      .then(({ isRegistered: registered, stateIndex: index }) => {
        setIsRegistered(registered);
        setStateIndex(index);
      })
      .catch(console.error);
  }, [
    isConnected,
    data?.publicKey,
    address,
    signer,
    setIsRegistered,
    setStateIndex,
  ]);

  return {
    isAllowedToVote,
    stateIndex,
    isRegistered,
    onSignup,
  };
};
