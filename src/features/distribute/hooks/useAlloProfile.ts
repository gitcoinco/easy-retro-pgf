import { useAccount, usePublicClient, useSendTransaction } from "wagmi";
import { abi as RegistryABI } from "@allo-team/allo-v2-sdk/dist/Registry/registry.config";
import { type Address, zeroAddress } from "viem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { solidityPackedKeccak256 } from "ethers";
import { useAlloRegistry, waitForLogs } from "./useAllo";

export function useAlloProfile() {
  const registry = useAlloRegistry();
  const { address } = useAccount();

  return useQuery({
    queryKey: ["allo/profile"],
    queryFn: async () => {
      const profileId = getProfileId(address);
      const profile = await registry?.getProfileById(profileId);
      if (profile?.anchor === zeroAddress) return null;
      return profile;
    },
    enabled: Boolean(registry && address),
  });
}

const NONCE = 3n;
export function useCreateAlloProfile() {
  const registry = useAlloRegistry();
  const { address } = useAccount();
  const client = usePublicClient();
  const { sendTransactionAsync } = useSendTransaction();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Connect wallet first");
      if (!registry) throw new Error("Allo Registry not initialized");

      const { to, data } = registry.createProfile({
        nonce: NONCE,
        members: [address],
        owner: address,
        metadata: { protocol: 1n, pointer: "" },
        name: "",
      });

      const hash = await sendTransactionAsync({ to, data });
      return waitForLogs(hash, RegistryABI, client).then(async (logs) => {
        await queryClient.invalidateQueries({ queryKey: ["allo/profile"] });
        return logs;
      });
    },
  });
}

function getProfileId(address?: Address) {
  return solidityPackedKeccak256(
    ["uint256", "address"],
    [NONCE, address],
  ) as `0x${string}`;
}
