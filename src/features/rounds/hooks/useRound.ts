import { useRouter } from "next/router";
import { toast } from "sonner";
import { api } from "~/utils/api";

export function useCurrentDomain() {
  return useRouter().query.domain as string;
}
export function useCurrentRound() {
  const domain = useCurrentDomain();
  return api.rounds.get.useQuery({ domain }, { enabled: Boolean(domain) });
}

export function useUpdateRound() {
  return api.rounds.update.useMutation({
    onSuccess: () => {
      toast.success("Round updated successfully!");
    },
    onError: (err: unknown) =>
      toast.error("Error updating round", {
        description: err?.toString(),
      }),
  });
}
