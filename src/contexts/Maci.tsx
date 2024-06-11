import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAccount, useSignMessage } from "wagmi";
import { isAfter } from "date-fns";
import {
  signup,
  isRegisteredUser,
  publishBatch,
  type TallyData,
  type IGetPollData,
  getPoll,
  genKeyPair,
} from "maci-cli/sdk";

import type { Attestation } from "~/utils/fetchAttestations";
import { config } from "~/config";
import { api } from "~/utils/api";
import { useEthersSigner } from "~/hooks/useEthersSigner";
import type { IVoteArgs, MaciContextType, MaciProviderProps } from "./types";

export const MaciContext = createContext<MaciContextType | undefined>(
  undefined,
);

export const MaciProvider: React.FC<MaciProviderProps> = ({ children }) => {
  const signer = useEthersSigner();
  const { address, isConnected, isDisconnected } = useAccount();

  const [isRegistered, setIsRegistered] = useState<boolean>();
  const [stateIndex, setStateIndex] = useState<string>();
  const [initialVoiceCredits, setInitialVoiceCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [pollData, setPollData] = useState<IGetPollData>();
  const [tallyData, setTallyData] = useState<TallyData>();

  const [maciPrivKey, setMaciPrivKey] = useState<string | undefined>();
  const [maciPubKey, setMaciPubKey] = useState<string | undefined>();

  const [signatureMessage, setSignatureMessage] = useState<string>("");

  const { signMessageAsync } = useSignMessage();
  const user = api.maci.user.useQuery(
    { publicKey: maciPubKey ?? "" },
    { enabled: Boolean(maciPubKey && config.maciSubgraphUrl) },
  );

  const attestations = api.voters.approvedAttestations.useQuery({
    address,
  });

  const attestationId = useMemo(() => {
    const values = attestations.data?.valueOf() as Attestation[] | undefined;

    const attestation = values?.find(
      (attestation) => config.admin === attestation.attester,
    );

    return attestation?.id;
  }, [attestations]);

  const isEligibleToVote = useMemo(
    () => Boolean(attestationId) && Boolean(address),
    [attestationId, address],
  );

  // on load get the key pair from local storage and set the signature message
  useEffect(() => {
    setSignatureMessage(`Generate MACI Key Pair at ${window.location.origin}`);
    const storedMaciPrivKey = localStorage.getItem("maciPrivKey");
    const storedMaciPubKey = localStorage.getItem("maciPubKey");

    if (storedMaciPrivKey && storedMaciPubKey) {
      setMaciPrivKey(storedMaciPrivKey);
      setMaciPubKey(storedMaciPubKey);
    }
  }, [setMaciPrivKey, setMaciPubKey]);

  const generateKeypair = useCallback(async () => {
    // if we are not connected then do not generate the key pair
    if (!address) {
      return;
    }

    const signature = await signMessageAsync({ message: signatureMessage });
    const userKeyPair = genKeyPair({ seed: BigInt(signature) });
    localStorage.setItem("maciPrivKey", userKeyPair.privateKey);
    localStorage.setItem("maciPubKey", userKeyPair.publicKey);
    setMaciPrivKey(userKeyPair.privateKey);
    setMaciPubKey(userKeyPair.publicKey);
  }, [address, signMessageAsync, setMaciPrivKey, setMaciPubKey]);

  const votingEndsAt = useMemo(
    () =>
      pollData
        ? new Date(
            Number(pollData.deployTime) * 1000 +
              Number(pollData.duration) * 1000,
          )
        : new Date(),
    [pollData?.deployTime, pollData?.duration],
  );

  const onSignup = useCallback(
    async (onError: () => void) => {
      if (!signer || !maciPubKey || !attestationId) {
        return;
      }

      setIsLoading(true);

      try {
        const { stateIndex: index, hash } = await signup({
          maciPubKey,
          maciAddress: config.maciAddress!,
          sgDataArg: attestationId,
          signer,
        });

        console.log(`Signup transaction hash: ${hash}`);

        if (index) {
          setIsRegistered(true);
          setStateIndex(index);
        }
      } catch (e) {
        onError();
        console.error("error happened:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [
      attestationId,
      maciPubKey,
      address,
      signer,
      setIsRegistered,
      setStateIndex,
      setIsLoading,
    ],
  );

  const onVote = useCallback(
    async (
      votes: IVoteArgs[],
      onError: () => Promise<void>,
      onSuccess: () => Promise<void>,
    ) => {
      if (!signer || !stateIndex || !pollData) {
        return;
      }

      if (!votes.length) {
        await onError();
        setError("No votes provided");
        return;
      }

      const messages = votes.map(
        ({ newVoteWeight, voteOptionIndex }, index) => ({
          newVoteWeight,
          voteOptionIndex,
          stateIndex: BigInt(stateIndex),
          maciContractAddress: config.maciAddress!,
          nonce: BigInt(index + 1),
        }),
      );

      setIsLoading(true);

      await publishBatch({
        messages,
        maciAddress: config.maciAddress!,
        publicKey: maciPubKey!,
        privateKey: maciPrivKey!,
        pollId: BigInt(pollData.id),
        signer,
      })
        .then(() => onSuccess())
        .catch((error: Error) => {
          setError(error.message);
          return onError();
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [
      stateIndex,
      pollData?.id,
      maciPubKey,
      maciPrivKey,
      signer,
      setIsLoading,
      setError,
    ],
  );

  useEffect(() => {
    if (isDisconnected) {
      setMaciPrivKey(undefined);
      setMaciPubKey(undefined);
      localStorage.removeItem("maciPrivKey");
      localStorage.removeItem("maciPubKey");
    }
  }, [isDisconnected]);

  useEffect(() => {
    generateKeypair().catch(console.error);
  }, [generateKeypair]);

  useEffect(() => {
    if (!maciPubKey || user.data) {
      return;
    }

    user.refetch().catch(console.error);
  }, [maciPubKey, user]);

  /// check if the user already registered
  useEffect(() => {
    if (!isConnected || !signer || !maciPubKey || !address || isLoading) {
      return;
    }

    const [account] = user.data?.accounts.slice(-1) ?? [];

    if (!config.maciSubgraphUrl) {
      isRegisteredUser({
        maciPubKey,
        maciAddress: config.maciAddress!,
        startBlock: config.maciStartBlock,
        signer,
      })
        .then(
          ({ isRegistered: registered, voiceCredits, stateIndex: index }) => {
            setIsRegistered(registered);
            setStateIndex(index);
            setInitialVoiceCredits(Number(voiceCredits));
          },
        )
        .catch(console.error);
    } else if (account) {
      const { id, voiceCreditBalance } = account;

      setIsRegistered(true);
      setStateIndex(id);
      setInitialVoiceCredits(Number(voiceCreditBalance));
    }
  }, [
    isLoading,
    isConnected,
    isRegistered,
    maciPubKey,
    address,
    signer,
    stateIndex,
    user.data,
    setIsRegistered,
    setStateIndex,
    setInitialVoiceCredits,
  ]);

  /// check the poll data and tally data
  useEffect(() => {
    if (!signer) {
      return;
    }

    setIsLoading(true);

    Promise.all([
      getPoll({
        maciAddress: config.maciAddress!,
        signer,
        provider: signer.provider,
      })
        .then((data) => {
          setPollData(data);
          return data;
        })
        .then(async (data) => {
          if (!data.isStateAqMerged || isAfter(votingEndsAt, new Date())) {
            return;
          }

          return fetch(`${config.tallyUrl}/tally-${data.id}.json`)
            .then((res) => res.json() as Promise<TallyData>)
            .then((res) => {
              setTallyData(res);
            })
            .catch(() => undefined);
        }),
    ])
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [Boolean(signer), setIsLoading, setTallyData, setPollData]);

  const value: MaciContextType = {
    isLoading,
    isEligibleToVote,
    initialVoiceCredits,
    votingEndsAt,
    stateIndex,
    isRegistered: isRegistered ?? false,
    pollId: pollData?.id.toString(),
    error,
    pollData,
    tallyData,
    maciPubKey,
    onSignup,
    onVote,
  };

  return <MaciContext.Provider value={value}>{children}</MaciContext.Provider>;
};

export const useMaci = (): MaciContextType => {
  const context = useContext(MaciContext);

  if (!context) {
    throw new Error("Should use context inside provider.");
  }

  return context;
};
