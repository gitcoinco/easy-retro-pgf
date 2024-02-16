import { useAccount, usePublicClient, useSendTransaction } from "wagmi";
import { abi as RegistryABI } from "@allo-team/allo-v2-sdk/dist/Registry/registry.config";
import { type Address, zeroAddress } from "viem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useAlloRegistry, waitForLogs } from "./useAllo";
import { allo } from "~/config";

export function useAlloProfile() {
  const registry = useAlloRegistry();
  const { address } = useAccount();

  return useQuery(
    ["allo/profile"],
    async () => {
      const profileId = getProfileId(address);
      const profile = await registry?.getProfileById(profileId);
      if (profile?.anchor === zeroAddress) return null;
      return profile;
    },
    { enabled: Boolean(registry && address) },
  );
}

const NONCE = 3;
export function useCreateAlloProfile() {
  const registry = useAlloRegistry();
  const { address } = useAccount();
  const client = usePublicClient();
  const { sendTransactionAsync } = useSendTransaction();
  const queryClient = useQueryClient();
  return useMutation(async () => {
    if (!address) throw new Error("Connect wallet first");
    if (!registry) throw new Error("Allo Registry not initialized");

    const { to, data } = registry.createProfile({
      nonce: NONCE,
      members: [address],
      owner: address,
      metadata: { protocol: 1n, pointer: "" },
      name: "",
    });

    const { hash } = await sendTransactionAsync({ to, data });
    return waitForLogs(hash, RegistryABI, client).then(async (logs) => {
      await queryClient.invalidateQueries(["allo/profile"]);
      return logs;
    });
  });
}
export function useAlloRegistryAddMember() {
  const registry = useAlloRegistry();
  const { address } = useAccount();
  const client = usePublicClient();
  const queryClient = useQueryClient();
  const { sendTransactionAsync } = useSendTransaction();
  return useMutation(async () => {
    if (!address) throw new Error("Connect wallet first");
    if (!registry) throw new Error("Allo Registry not initialized");

    const profileId = getProfileId(address);
    const { to, data } = registry.addMembers({
      profileId,
      members: [allo.strategyAddress],
    });

    const { hash } = await sendTransactionAsync({ to, data });
    return waitForLogs(hash, RegistryABI, client).then(async (logs) => {
      await queryClient.invalidateQueries(["allo/registry/member"]);
      return logs;
    });
  });
}

export function useAlloIsMemberOfProfile() {
  const registry = useAlloRegistry();
  const { address } = useAccount();

  const profileId = getProfileId(address);

  return useQuery(
    ["allo/registry/member"],
    async () => {
      return registry?.isMemberOfProfile({
        profileId,
        account: allo.strategyAddress,
      });
    },
    { enabled: Boolean(registry && address) },
  );
}

function getProfileId(address?: Address) {
  const { solidityKeccak256 } = ethers.utils;
  return solidityKeccak256(["uint256", "address"], [NONCE, address]);
}
