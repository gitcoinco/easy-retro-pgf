import { useAccount, usePublicClient, useSendTransaction } from "wagmi";
import { abi as RegistryABI } from "@allo-team/allo-v2-sdk/dist/Registry/registry.config";
import { type Address, zeroAddress } from "viem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useAlloRegistry, waitForLogs } from "./useAllo";

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

export function useCreateAlloProfile() {
  const registry = useAlloRegistry();
  const { address } = useAccount();
  const client = usePublicClient();
  const { sendTransactionAsync } = useSendTransaction();
  return useMutation(async () => {
    if (!address) throw new Error("Connect wallet first");
    if (!registry) throw new Error("Allo Registry not initialized");

    const { to, data } = registry.createProfile({
      nonce: 1,
      members: [address],
      owner: address,
      metadata: { protocol: 1n, pointer: "" },
      name: "",
    });

    const { hash } = await sendTransactionAsync({ to, data });
    return waitForLogs(hash, RegistryABI, client);
  });
}

function getProfileId(address?: Address) {
  const { solidityKeccak256 } = ethers.utils;
  return solidityKeccak256(["uint256", "address"], [1, address]);
}
