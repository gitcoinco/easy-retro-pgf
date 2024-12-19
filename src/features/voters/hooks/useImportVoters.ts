import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "~/utils/api";
import { parse } from "~/utils/csv";
import { getAddress } from "viem";
import { useVoters, useApproveVoters } from "./useApproveVoters";

interface VoterData {
  address: string;
  maxVotesTotal: number;
  maxVotesProject: number;
}

export function useImportVoters() {
  const utils = api.useContext();
  const { data: existingVoters } = useVoters();
  const approveVoters = useApproveVoters({
    onSuccess: () => {
      toast.success("Voters approved successfully");
      void utils.voters.list.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to approve voters", {
        description: error.reason ?? error.data?.message ?? "Unknown error",
      });
    },
  });

  const createVoters = api.voters.createVoters.useMutation({
    onSuccess: () => {
      void utils.voters.list.invalidate();
    },
  });

  return useMutation({
    mutationFn: async (file: File) => {
      const csvString = await file.text();
      const { data } = parse<VoterData>(csvString);

      const validatedData = data.map(
        ({ address, maxVotesTotal, maxVotesProject }, index) => {
          const validatedAddress = getAddress(address);
          const validatedMaxVotesTotal = Number(maxVotesTotal);
          const validatedMaxVotesProject = Number(maxVotesProject);

          if (isNaN(validatedMaxVotesTotal) || validatedMaxVotesTotal <= 0) {
            throw new Error(
              `Invalid maxVotesTotal for address ${validatedAddress} at row ${index + 1}`,
            );
          }

          if (
            isNaN(validatedMaxVotesProject) ||
            validatedMaxVotesProject <= 0
          ) {
            throw new Error(
              `Invalid maxVotesProject for address ${validatedAddress} at row ${index + 1}`,
            );
          }

          if (validatedMaxVotesProject > validatedMaxVotesTotal) {
            throw new Error(
              `maxVotesProject cannot be greater than maxVotesTotal for address ${validatedAddress} at row ${index + 1}`,
            );
          }

          return {
            address: validatedAddress,
            maxVotesTotal: validatedMaxVotesTotal,
            maxVotesProject: validatedMaxVotesProject,
          };
        },
      );
      console.log("Creating voterConfigs", validatedData);
      const upsertedVoters = await createVoters.mutateAsync(validatedData);

      const existingVoterAddresses = new Set(
        existingVoters?.map((v) => v.recipient.toLowerCase()),
      );
      const newVoters = upsertedVoters.filter(
        (v) => !existingVoterAddresses.has(v.voterId.toLowerCase()),
      );

      console.log("Creating attestations for:", newVoters);
      if (newVoters.length > 0) {
        const newVoterIds = newVoters.map((voter) => voter.voterId);
        await approveVoters.mutateAsync(newVoterIds);
      }

      return upsertedVoters;
    },
    onSuccess: (upsertedVoters) => {
      toast.success(
        `${upsertedVoters.length} voters imported/updated successfully`,
      );
      void utils.voters.list.invalidate();
    },
    onError: (error: Error) => {
      toast.error("Failed to import/update voters", {
        description: error.message,
      });
    },
  });
}
